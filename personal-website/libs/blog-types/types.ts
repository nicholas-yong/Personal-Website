export interface BlogItem {
	id: number
	title: string
	mainPicture: string // url of the main picture to serve
	teaser: string
	publicationDate: number // unix timestamp in numbers
}

export type BlogTags = "food" | "coding" | "stories" | "general" | "anime"
