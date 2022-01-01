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
				handler: "bin/lambda.handler",
				runtime: "nodejs14.x"
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

		// Add CloudWatch Logging
		const blogLogGroup = new aws.cloudwatch.LogGroup(
			`${stackName}-blogLogGroup`,
			{
				retentionInDays: 14
			},
			{
				parent: this
			}
		)

		const lambdaLogging = new aws.iam.Policy(
			`${stackName}-blogLambdaLogging`,
			{
				path: "/",
				description: "IAM policy for logging from a lambda",
				policy: `{
                             "Version": "2012-10-17",
                             "Statement": 
                             [
                                {
                                "Action": [
                                    "logs:CreateLogGroup",
                                    "logs:CreateLogStream",
                                    "logs:PutLogEvents"
                                ],
                                "Resource": "arn:aws:logs:*:*:*",
                                "Effect": "Allow"
                                }
                             ]
                        }
        `
			},
			{
				parent: this
			}
		)

		//Attach the IAM policy to the Lambda Function
		const lambdaLogPolicyAttachment = new aws.iam.RolePolicyAttachment(
			`${stackName}-LambdaLogPolicyAttachment`,
			{
				role: lambdaIAMRole,
				policyArn: pulumi.output(lambdaLogging.arn)
			},
			{
				parent: this
			}
		)
	}
}
