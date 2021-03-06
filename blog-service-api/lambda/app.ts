import express from "express"
import bodyParser from "body-parser"
import { CreateBlogItemDTO, UpdateBlogItemDTO } from "@nicholas-yong/blog-types"
import { blogRequestHandler } from "./handlers"
import { loggerMiddleware } from "./middleware/logger"

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(loggerMiddleware)

// Setup routes
app.get(`/blog/:id`, async (req, res) => {
	const id = req.params.id as string

	if (!id) {
		return res.status(404).send("test")
	}

	const result = await blogRequestHandler({
		requestType: "getBlogItem",
		item: Number.parseInt(id),
		log: req.log
	})

	return res.json(result)
})

app.post(`/blog`, async (req, res) => {
	const blogItem = JSON.parse(req.body) as CreateBlogItemDTO

	if (!blogItem) {
		return res.status(400)
	}

	const result = await blogRequestHandler({
		requestType: "createBlogItem",
		item: blogItem,
		log: req.log
	})

	return res.json(result)
})

app.get(`/blog/listing/:number`, async (req, res) => {
	// Returns the last x (where x = number in the query param) of blog articles
	// Returns all blog items if there aren't enough to fulfill the request

	const numItems = req.params.number

	if (!numItems) {
		return res.status(404)
	}

	return
})

app.put(`/blog/:id`, async (req, res) => {
	const id = req.params.id as string
	const blogItem = JSON.parse(req.body) as UpdateBlogItemDTO

	if (!id) {
		return res.status(404)
	}

	const result = await blogRequestHandler({
		requestType: "updateBlogItem",
		item: blogItem,
		log: req.log
	})

	return res.json(result)
})

app.delete(`/blog/:id`, async (req, res) => {
	const id = req.params.id as string

	if (!id) {
		return res.status(404)
	}

	const result = await blogRequestHandler({
		requestType: "deleteBlogItem",
		item: Number.parseInt(id),
		log: req.log
	})

	return res.json(result)
})

app.listen(3000)
