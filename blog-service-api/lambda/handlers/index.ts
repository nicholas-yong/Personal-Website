import {
	isCreateBlogItemDTO,
	isNumber,
	isUpdateBlogItemDTO,
	RequestHandlerParams
} from "../types"
import { DBClient } from "@nicholas-yong/db-client"

export const blogRequestHandler = async ({
	requestType,
	item,
	log
}: RequestHandlerParams) => {
	// Let's log out all the requests that are coming to the Blogh Request Handler
	log.info(
		{
			requestType,
			item
		},
		"Request Objects"
	)

	const dbClient = new DBClient(log)

	try {
		switch (requestType) {
			case "getBlogItem":
				if (!isNumber(item)) {
					throw new Error("Invalid item type")
				}
				await dbClient.getItem(item)
				break
			case "getBlogItemList":
				// Let's leave this for now.
				break
			case "updateBlogItem":
				if (!isUpdateBlogItemDTO(item)) {
					throw new Error("Invalid item type")
				}
				await dbClient.updateItem(item)
				break
			case "deleteBlogItem":
				if (!isNumber(item)) {
					throw new Error("Invalid item type")
				}
				await dbClient.deleteItem(item)
				break
			case "createBlogItem":
				if (!isCreateBlogItemDTO(item)) {
					throw new Error("Invalid item type")
				}
				await dbClient.createItem(item)
				break
		}
	} catch (e) {
		console.error(e)
	}

	return
}
