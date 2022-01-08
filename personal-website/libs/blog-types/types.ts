export type BlogTags = "food" | "coding" | "stories" | "general" | "anime"

export interface BlogItemDTO {
	id: number
	rev: string
	title: string
	mainPicture: string
	teaser: string
	publicationDate: number // unix timestamp
	content: string
	tags: Array<BlogTags>
}

export interface CreateBlogItemDTO {
	title: string
	mainPicture: string
	teaser: string
	content: string
	tags: Array<BlogTags>
}

export interface GetBlogItemDTO {
	id: number
	title: string
	mainPicture: string
	teaser: string
	publicationDate: number // unix timestamp'
	content: string
	tags: Array<BlogTags>
}

export type UpdateBlogItemDTO = CreateBlogItemDTO

export interface DeleteBlogItemDTO {
	id: number
}
