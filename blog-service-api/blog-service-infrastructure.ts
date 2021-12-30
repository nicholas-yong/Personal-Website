import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"

export class BlogServiceAPI extends pulumi.ComponentResource {
	constructor(name, opts) {
		super("blog-service-infrastructure:blogServiceAPI", name, {}, opts)

		// Name of executing stack
		const stackName = pulumi.getStack()

		const lambdaIAMRole = new aws.iam.Role(
			`${stackName}-stacklambdaIAMRole`,
			{
				assumeRolePolicy: `{
            "Version": "2012-10-17",
            "Statement": [
              {
                "Action": "sts:AssumeRole",
                "Principal": {
                  "Service": "lambda.amazonaws.com"
                },
                "Effect": "Allow",
                "Sid": ""
              }
            ]
          }
          `
			},
			{ parent: this }
		)

		// This Lambda will need to access dynamo to query information, as well as be called via LAMBDA_PROXY from an API Gateway.
		const blogServiceLambda = new aws.lambda.Function(
			`${stackName}-blogServiceLambda`,
			{
				code: new pulumi.asset.FileArchive("blog-service-api.zip"),
				role: lambdaIAMRole.arn,
				handler: "lambda.test",
				runtime: "nodejs12.x"
			},
			{
				parent: this
			}
		)

		// Create the API Gateway first
		const blogAPIGateway = new aws.apigatewayv2.Api(
			"blogAPIGateway",
			{
				protocolType: "HTTP",
				target: pulumi.output(blogServiceLambda.arn)
			},
			{
				parent: this
			}
		)

		new aws.lambda.Permission(
			`${stackName}-lambdaPermission`,
			{
				action: "lambda:InvokeFunction",
				principal: "apigateway.amazonaws.com",
				function: blogServiceLambda,
				sourceArn: pulumi.interpolate`${blogAPIGateway.executionArn}/*/*`
			},
			{ parent: this }
		)
	}
}
