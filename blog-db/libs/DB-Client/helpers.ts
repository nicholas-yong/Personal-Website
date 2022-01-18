import * as aws from "aws-sdk"
import { Logger } from "pino"
import { DBClientConfiguration } from "./types"
import nconf from "nconf"

export const getNumBlogItems = async () => {
	try {
		// Setup the SDK
		const ssm = new aws.SSM()

		const params = {
			Name: "numBlogs"
		}

		const result = ssm.getParameter(params, (err, data) => {
			if (data && data.Parameter) {
				return data.Parameter.Value
			}

			return
		})

		return
	} catch (e) {
		console.error(e)
	}
}

export const setupAWSConnection = (log: Logger): DBClientConfiguration => {
	aws.config.update({
		region: "ap-southeast-2"
	})

	const db = new aws.DynamoDB({
		apiVersion: "2012-08-10"
	})

	try {
		nconf.file("./config.json")

		nconf.load()

		log.info({
			test1: nconf.get("tableName"),
			test2: nconf.get("ssmBlogCountName")
		})
	} catch (e) {
		console.error(e)
	}

	return {
		items: nconf,
		db
	}
}
