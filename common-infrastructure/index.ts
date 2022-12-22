import { DomainInfrastructure } from "./domain-infrastructure";

export const domainInfrastructure = new DomainInfrastructure(`domain-infrastructure`, {})

export const certificateArn = domainInfrastructure.certificateArn
