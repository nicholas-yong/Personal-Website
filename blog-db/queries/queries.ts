import * as aws from "aws-sdk"
import { getParams } from "../types"
import nconf from "nconf"

aws.config.update({
	region: "ap-southeast-2"
})

const db = new aws.DynamoDB({
	apiVersion: "2012-08-10"
})

nconf.argv().env().file({
	file: "./dev.config.json"
})

export const getItem = (id: getParams) => {
	try {
		// either a number or the string latest
		// Unary operator(+) will convert string to number
		if (id !== "latest" || !isNaN(+id)) {
			throw new Error(`Invalid parameter ${id} passed`)
		}

		const wantLatest = id === "latest"

		const queryParams: aws.DynamoDB.GetItemInput = {
			TableName: nconf.get("tableName") as string,

		}

		const getItem = db.getItem
	} catch {}
}

export const addItem = () => {
	const params = {
		TableName: ""
	}
}
