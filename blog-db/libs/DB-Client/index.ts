import { setupAWSConnection } from "./helpers"
import { DBClientConfiguration } from "./types"
import {
	CreateBlogItemDTO,
	BlogItemDTO,
	UpdateBlogItemDTO
} from "@nicholas-yong/blog-types"
import * as aws from "aws-sdk"
import { Logger } from "pino"

export class DBClient {
	private config: DBClientConfiguration

	constructor(private log: Logger) {
		// Setup Configuration -- this will throw if there isn't a config file inside the root of the project.
		this.config = setupAWSConnection(log)
	}

	async queryBatchItems(id: number): Promise<Array<BlogItemDTO> | void> {
		try {
			if (!id) {
				// Note that 0 is falsy, not that it's possible to have an ID of 0 anyway.
				throw new Error("No ID passed to function")
			}

			// We need to get the current rev of the item
			const queryParams: aws.DynamoDB.QueryInput = {
				KeyConditionExpression: "BlogID = :id",
				TableName: this.config.items.get("tableName") as string,
				ExpressionAttributeValues: {
					":id": {
						S: id.toString()
					}
				},
				ScanIndexForward: false
			}

			const { $response } = await this.config.db
				.query(queryParams)
				.promise()

			let output: Array<BlogItemDTO> = []

			if ($response && $response.data) {
				const responseResult = $response.data.Items

				if (responseResult) {
					output = responseResult.map((result) => {
						return aws.DynamoDB.Converter.unmarshall(
							result
						) as BlogItemDTO
					})
				}
			} else {
				throw new Error("Unable to get latest result rev of item")
			}

			return output
		} catch (e) {
			console.error(e)
		}
	}

	async getItem(id: number): Promise<BlogItemDTO | void> {
		try {
			// either a number or the string latest
			// Unary operator(+) will convert string to number
			if (isNaN(+id)) {
				throw new Error(`Invalid parameter ${id} passed`)
			}

			const queryParams: aws.DynamoDB.GetItemInput = {
				TableName: this.config.items.get("tableName") as string,
				Key: {
					BlogID: {
						S: id.toString()
					},
					ItemType: {
						S: "Current"
					}
				}
			}

			const { $response, Item } = await this.config.db
				.getItem(queryParams)
				.promise()

			if ($response.error) {
				const error = $response.error
				throw new Error(error.message)
			}

			if (Item) {
				return aws.DynamoDB.Converter.unmarshall(Item) as BlogItemDTO
			}

			return
		} catch (e) {
			console.error(e)
		}
	}

	async createItem(item: CreateBlogItemDTO): Promise<BlogItemDTO | void> {
		try {
			const ssm = new aws.SSM()

			const { Parameter } = await ssm
				.getParameter({
					Name: this.config.items.get("ssmBlogCountName") as string
				})
				.promise()

			if (!Parameter || !Parameter.Value) {
				throw new Error("Could not get current blog count from SSM")
			}

			const newBlogID = (Parameter.Value + 1).toString()

			// We will return the created item to the client as a BlogItemDTO
			const queryParams: aws.DynamoDB.PutItemInput = {
				TableName: this.config.items.get("tableName") as string,
				Item: {
					BlogID: {
						S: newBlogID
					},
					ItemType: {
						S: "Current"
					},
					Title: {
						S: item.title
					},
					MainPicture: {
						S: item.mainPicture
					},
					Teaser: {
						S: item.teaser
					},
					PublicationDate: {
						N: new Date().getTime().toString()
					},
					Content: {
						S: item.content
					},
					Tags: {
						SS: item.tags
					}
				}
			}

			// We don't need the response (bills :() )
			await this.config.db.putItem(queryParams).promise()

			// Need to update SSM to the next current BlogID
			await ssm
				.putParameter({
					Name: this.config.items.get("ssmBlogCountName") as string,
					Value: newBlogID,
					Overwrite: true
				})
				.promise()

			// Get the newly added item from the Table
			const result = (await this.getItem(
				Number.parseInt(newBlogID)
			)) as BlogItemDTO

			return result
		} catch (e) {
			console.error(e)
		}
	}

	async createRevItem(id: number, item: CreateBlogItemDTO): Promise<void> {
		try {
			if (!id || !item) {
				throw new Error("Invalid parameters passed")
			}

			const output = this.queryBatchItems(id)

			// We know that due to the scan index forward, that the first item has to be the latest
			const latest = output[0]
			const insertParams: aws.DynamoDB.PutItemInput = {
				TableName: this.config.items.get("tableName") as string,
				Item: {
					BlogID: {
						S: latest.id.toString()
					},
					ItemType: {
						S: latest.rev
					},
					Title: {
						S: item.title
					},
					MainPicture: {
						S: item.mainPicture
					},
					Teaser: {
						S: item.teaser
					},
					PublicationDate: {
						N: new Date().getTime().toString()
					},
					Content: {
						S: item.content
					},
					Tags: {
						SS: item.tags
					}
				}
			}

			await this.config.db.putItem(insertParams).promise()
		} catch (e) {
			console.error(e)
		}
	}

	async updateItem(item: UpdateBlogItemDTO): Promise<any> {
		try {
			// We can add in shape validation later once we're sure all of this actually works
			if (!item) {
				throw new Error("Item to update is not defined")
			}

			// We first need to query what the thing is updating and then insert a copy of that...
			const currentItem = await this.getItem(item.id)

			// Transform the result into a CreateItemBlogDTO so that we can insert it as a revision
			if (!currentItem) {
				throw new Error(
					`Current version of Blog Item ${item.id} not found`
				)
			}

			// Insert a revision of that item first.
			await this.createRevItem(currentItem.id, currentItem)

			// Update the item
			const updateParams: aws.DynamoDB.UpdateItemInput = {
				TableName: this.config.items.get("tableName") as string,
				ExpressionAttributeNames: {
					"#T": "Title",
					"#MP": "MainPicture",
					"#TE": "Teaser",
					"#PD": "PublicationDate",
					"#C": "Content",
					"#TA": "Tags"
				},
				ExpressionAttributeValues: {
					":t": {
						S: item.title
					},
					":mp": {
						S: item.mainPicture
					},
					":te": {
						S: item.teaser
					},
					":pd": {
						S: new Date().getTime().toString()
					},
					":c": {
						S: item.content
					},
					":ta": {
						SS: item.tags
					}
				},
				Key: {
					BlogID: {
						S: item.id.toString()
					},
					ItemType: {
						S: "Current"
					}
				},
				ReturnValues: "ALL_NEW",
				UpdateExpression:
					"SET #T = :t, #MP = :mp, #TE = :te, #PD = :pd, #C = :c, #TA = :ta"
			}

			const updateResult = await this.config.db
				.updateItem(updateParams)
				.promise()

			return updateResult.Attributes
		} catch (e) {
			console.error(e)
		}
	}

	deleteItem = async (id: number) => {
		try {
			const output = await this.queryBatchItems(id)

			if (!output || (output && output.length <= 0)) {
				throw new Error(
					"Invalid items returned from queryBatchItems function"
				)
			}

			for (const item of output) {
				const deleteParams: aws.DynamoDB.DeleteItemInput = {
					TableName: this.config.items.get("tableName") as string,
					Key: {
						BlogID: {
							S: item.id.toString()
						},
						ItemType: {
							S: item.rev
						}
					}
				}

				await this.config.db.deleteItem(deleteParams).promise()
			}
		} catch (e) {
			console.error(e)
		}
	}
}
