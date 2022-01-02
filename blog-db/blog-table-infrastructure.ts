import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"

export class BlogTables extends pulumi.ComponentResource {
	constructor(name, opts) {
		super("blog-service-infrastructure:BlogTables", name, {}, opts)

		// Name of executing stack
		const stackName = pulumi.getStack()

		const blogTable = new aws.dynamodb.Table(
			`${stackName}-blog-table`,
			{
				attributes: [
					{
						name: "BlogID",
						type: "S"
					},
					{
						name: "Rev",
						type: "N"
					}
				],
				hashKey: "BlogID",
				rangeKey: "Rev",
				billingMode: "PAY_PER_REQUEST"
			},
			{
				parent: this
			}
		)

		const blogNumber = new aws.ssm.Parameter("numBlogs", {
			type: "String",
			value: "0"
		})
	}
}
