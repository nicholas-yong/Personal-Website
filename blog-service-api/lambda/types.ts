import { Logger } from "pino"
import { CreateBlogItemDTO, UpdateBlogItemDTO } from "@nicholas-yong/blog-types"

export type BlogRequestTypes =
	| "getBlogItem"
	| "updateBlogItem"
	| "deleteBlogItem"
	| "getBlogItemList"
	| "deleteBlogItem"
	| "createBlogItem"

export type RequestItem =
	| number
	| Array<number>
	| CreateBlogItemDTO
	| UpdateBlogItemDTO

export interface RequestHandlerParams {
	requestType: BlogRequestTypes
	item: RequestItem
	log: Logger
}
// Helpful typeguards
export const isNumber = (item: RequestItem): item is number => {
	return typeof item === "number"
}

export const isArray = (item: RequestItem): item is Array<number> => {
	return Array.isArray(item) && typeof item[0] === "number"
}

export const isCreateBlogItemDTO = (
	item: RequestItem
): item is CreateBlogItemDTO => {
	return typeof item === "object" && "title" in item
}

export const isUpdateBlogItemDTO = (
	item: RequestItem
): item is UpdateBlogItemDTO => {
	return typeof item === "object" && "id" in item
}
