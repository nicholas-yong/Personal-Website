import { setupAWSConnection } from "./helpers";
import { DBClientConfiguration } from "./types";
import {
    CreateBlogItemDTO,
    BlogItemDTO,
    UpdateBlogItemDTO
} from '@nicholas-yong/blog-types'
import * as aws from 'aws-sdk'

export class DBClient
{
    private config: DBClientConfiguration

    constructor()
    {
        // Setup Configuration -- this will throw if there isn't a config file inside the root of the project.
        this.config = setupAWSConnection()
    }

    async getItem(id: string): Promise<BlogItemDTO | void>
    {
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
                        S: id
                    },
                    ItemType: {
                        S: "Current"
                    }
                }
            }
    
            const { $response, Item } = await this.config.db.getItem(queryParams).promise()
    
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

    async createItem (
        item: CreateBlogItemDTO
    ): Promise<BlogItemDTO | void>{
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
    
            const newBlogID = (Number.parseInt(Parameter.Value) + 1).toString()
    
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
                    Value: newBlogID
                })
                .promise()
    
            // Get the newly added item from the Table
            const result = (await this.getItem(newBlogID)) as BlogItemDTO
    
            return result
        } catch (e) {
            console.error(e)
        }
    }
    
    async updateItem(item: UpdateBlogItemDTO): Promise<void>
    {
        try
        {
            // We probably want some sort of shape validation, for now since we don't have internet, let's just test for undefined
            if(!item)
            {
                throw new Error('Item to update is not defined')
            } 
        }
        catch(e)
        {
            console.error(e)
        }
    }
}