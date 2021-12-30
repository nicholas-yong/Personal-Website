import * as pulumi from "@pulumi/pulumi"
import * as aws from "@pulumi/aws"
import * as awsx from "@pulumi/awsx"

const lambdaIAMRole = new aws.iam.Role("lambdaIAMRole", {
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
})

// This Lambda will need to access dynamo to query information, as well as be called via LAMBDA_PROXY from an API Gateway.
const blogServiceLambda = new aws.lambda.Function("blogServiceLambda", {
	code: new pulumi.asset.FileArchive("lambda_function_payload.zip"),
	role: lambdaIAMRole.arn,
	handler: "index.test",
	runtime: "nodejs12.x",
	environment: {
		variables: {
			foo: "bar"
		}
	}
})
