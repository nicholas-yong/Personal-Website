import * as aws from "aws-sdk"
import nconf from 'nconf'
import { DBClientConfiguration } from "./types"
import { dirname } from "path"


export const getNumBlogItems = async () => {
	try {
		// Setup the SDK
		const ssm = new aws.SSM()

		const params = {
			Name: "numBlogs"
		}

		const result = ssm.getParameter(params, (err, data) => {
			if (data) {
				return data.Parameter.Value
			}
		})

		return
	} catch (e) {
		console.error(e)
	}
}

export const setupAWSConnection = (): DBClientConfiguration => {
	aws.config.update({
		region: "ap-southeast-2"
	})
	
	const db = new aws.DynamoDB({
		apiVersion: "2012-08-10"
	})

	try
	{
		// Need to get the root of the project here.

		const root = dirname(require.main.filename)

		nconf.argv().env().file({
			file: `${root}/dev.config.json`
		})
	}
	catch(e)
	{
		console.error(e)
	}
	
	return {
		items: nconf,
		db
	}
}