import { BlogItemDTO, CreateBlogItemDTO } from "@nicholas-yong/blog-types"
import { getItem, createItem } from "./queries/queries"

console.log("test")

const testItem: CreateBlogItemDTO = {
	title: "HOPE",
	mainPicture: "www.test.com",
	teaser: "asdasd",
	content: "TEST",
	tags: ["anime"]
}

createItem(testItem).then((result) => {
	console.log(result)
})

// const result = getItem("1").then((data) => {
// 	console.log(data)
// })

// console.log(result)
