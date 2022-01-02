import * as aws from "aws-sdk"

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
