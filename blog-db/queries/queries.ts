import * as aws from "aws-sdk"
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

export const getItem = (id: string) => {
	try {
		// either a number or the string latest
		// Unary operator(+) will convert string to number
		if (!isNaN(+id)) {
			throw new Error(`Invalid parameter ${id} passed`)
		}

		const queryParams: aws.DynamoDB.GetItemInput = {
			TableName: nconf.get("tableName") as string,
			Key: {
				BlogID: {
					S: id
				}
			}
		}

		const getItem = db.getItem(queryParams, (error, data) => {
            if(error)
            {
                throw new Error(error.message)
            }
            else
            {
                return data.Item as 
            }
        }

	} catch {}
}

export const addItem = () => {
	const params = {
		TableName: ""
	}
}
