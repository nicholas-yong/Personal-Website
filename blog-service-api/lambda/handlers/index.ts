import { BlogRequestTypes } from "../types"
import pino from "pino"

export const blogRequestHandler = async (requestType: BlogRequestTypes) => {
	const logger = pino()
	logger.info(
		{
			requestType
		},
		"REQUEST TYPE"
	)

	switch (requestType) {
		case "getBlogItem":
			break
		case "getBlogItemList":
			break
		case "updateBlogItem":
			break
		case "deleteBlogItem":
			break
		case "createBlogItem":
			break
	}

	return
}
