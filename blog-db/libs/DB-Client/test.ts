import { DBClient } from "."
import pino from "pino"

const logger = pino()

const db = new DBClient(logger)

const id = 1

const result = db.getItem(id)

result.then((id) => {
	console.log(id)
})
