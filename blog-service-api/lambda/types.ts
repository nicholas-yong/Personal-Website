import { BlogTags } from "@nicholas-yong/blog-types"

export type BlogRequestTypes =
	| "getBlogItem"
	| "updateBlogItem"
	| "deleteBlogItem"
	| "getBlogItemList"
	| "deleteBlogItem"
	| "createBlogItem"

export interface CreateBlogItemDTO {
	title: string
	mainPicture: string
	teaser: string
	content: string
	tags: Array<BlogTags>
}
