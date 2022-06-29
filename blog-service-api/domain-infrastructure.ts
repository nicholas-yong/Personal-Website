import * as aws from "@pulumi/aws"
import * as pulumi from "@pulumi/pulumi"
import { P } from "pino"

export class DomainInfrastructure extends pulumi.ComponentResource {
    certificateArn: pulumi.Output<string>

    constructor(name, opts)
    {
        super("blog-service-infrastructure:DomainInfrastructure", name, {}, opts)

        const cert = new aws.acm.Certificate(`${name}-site-cert`, {
            domainName: 'justlostinlove.com',
            tags: {},
            validationMethod: "DNS",
        })

        this.certificateArn = cert.arn

        this.registerOutputs({
            certificateArn: cert.arn
        })

    }
}
