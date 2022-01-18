import { DBClient } from "."
import pino from "pino"

const logger = pino()

const tester = new DBClient(logger)

tester.createItem({
	title: "test",
	mainPicture: "www.test.com",
	teaser: "Test of a lifetime...",
	content: "Dream...",
	tags: ["food"]
})
