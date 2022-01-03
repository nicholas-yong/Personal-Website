import * as aws from "aws-sdk"
import nconf from "nconf"
import {
	CreateBlogItemDTO,
	GetBlogItemDTO,
	BlogItemDTO
} from "@nicholas-yong/blog-types"

aws.config.update({
	region: "ap-southeast-2"
})

const db = new aws.DynamoDB({
	apiVersion: "2012-08-10"
})

nconf.argv().env().file({
	file: "./dev.config.json"
})

export const createItem = async (
	item: CreateBlogItemDTO
): Promise<BlogItemDTO | void> => {
	try {
		const ssm = new aws.SSM()

		const { Parameter } = await ssm
			.getParameter({
				Name: nconf.get("ssmBlogCountName") as string
			})
			.promise()

		if (!Parameter || !Parameter.Value) {
			throw new Error("Could not get current blog count from SSM")
		}

		const newBlogID = (Number.parseInt(Parameter.Value) + 1).toString()

		// We will return the created item to the client as a BlogItemDTO
		const queryParams: aws.DynamoDB.PutItemInput = {
			TableName: nconf.get("tableName") as string,
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
		await db.putItem(queryParams).promise()

		// Need to update SSM to the next current BlogID
		await ssm
			.putParameter({
				Name: nconf.get("ssmBlogCountName") as string,
				Value: newBlogID
			})
			.promise()

		// Get the newly added item from the Table
		const result = (await getItem(newBlogID)) as BlogItemDTO

		return result
	} catch (e) {
		console.error(e)
	}
}

export const getItem = async (id: string): Promise<BlogItemDTO | void> => {
	try {
		// either a number or the string latest
		// Unary operator(+) will convert string to number
		if (isNaN(+id)) {
			throw new Error(`Invalid parameter ${id} passed`)
		}

		// const result = await db
		// 	.describeTable({
		// 		TableName: nconf.get("tableName") as string
		// 	})
		// 	.promise()

		// console.log("Test")

		// console.log(result.Table && result.Table.KeySchema)

		const queryParams: aws.DynamoDB.GetItemInput = {
			TableName: nconf.get("tableName") as string,
			Key: {
				BlogID: {
					S: id
				},
				ItemType: {
					S: "Current"
				}
			}
		}

		const { $response, Item } = await db.getItem(queryParams).promise()

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

export const addItem = () => {
	const params = {
		TableName: ""
	}
}
