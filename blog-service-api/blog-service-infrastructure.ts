import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import * as awsx from '@pulumi/awsx'
import pino from 'pino'

export class BlogServiceAPI extends pulumi.ComponentResource {
	constructor(name,  opts) {
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

		const cert = new aws.acm.Certificate(`${name}-site-cert`, {
            domainName: 'justlostinlove.com',
            tags: {},
            validationMethod: "DNS",
        }, {
			parent: this
		})

		const baseZone = new aws.route53.Zone(`${name}-cert-zone`, {
			name: "justlostinlove.com",
		}, {
			parent: this
		})


		const apiBlog = new aws.apigatewayv2.Api(`${name}-rest-api`, {
			protocolType: 'HTTP'
		}, {
			parent: this
		})

		const exampleRecord: aws.route53.Record[] = []

		const output = pulumi.all([cert.domainValidationOptions, baseZone]).apply(([validationOptions, zones]) => {
			validationOptions.map((validationOption) => {
				exampleRecord.push(new aws.route53.Record(`exampleRecord-${validationOption.domainName}`, {
					allowOverwrite: true,
					name: validationOption.domainName,
					records: [validationOption.resourceRecordValue],
					ttl: 5 * 60,
					type: validationOption.resourceRecordType,
					zoneId: zones.zoneId,
				}, {
					parent: this
				}));
			})
		})


		new aws.acm.CertificateValidation(`${name}-cert-validation`, {
			certificateArn: cert.arn,
			validationRecordFqdns: exampleRecord.map((record) => record.fqdn),
		}, {
			parent: this
		});


		new aws.apigatewayv2.Integration(`${name}-rest-api-integration`, {
			integrationType: 'AWS_PROXY',
			integrationUri: blogServiceLambda.arn,
			apiId: apiBlog.id
		}, {
			parent: this
		})

		// new aws.apigatewayv2.DomainName(
		// `${stackName}-api-domain-name`, 
		// 	{
		// 		domainName: 'api.justlostinlove.com',
		// 		domainNameConfiguration:
		// 		{
		// 			certificateArn:  cert.arn,
		// 			endpointType: 'REGIONAL',
		// 			securityPolicy: 'TLS_1_2'
		// 		}
		// 	}, 
		// 	{
		// 		parent: this
		// 	})

		new aws.lambda.Permission(
			`${stackName}-lambdaPermission`,
			{
				action: "lambda:InvokeFunction",
				principal: "apigateway.amazonaws.com",
				function: blogServiceLambda,
				sourceArn: pulumi.interpolate`${apiBlog.executionArn}/*/*`
			},
			{ parent: this }
		)

		// Add CloudWatch Logging
		new aws.cloudwatch.LogGroup(
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
		 new aws.iam.RolePolicyAttachment(
			`${stackName}-LambdaLogPolicyAttachment`,
			{
				role: lambdaIAMRole,
				policyArn: pulumi.output(lambdaLogging.arn)
			},
			{
				parent: this
			}
		)



		this.registerOutputs({
			apiEndpoint: apiBlog.apiEndpoint
		})
	}
}
