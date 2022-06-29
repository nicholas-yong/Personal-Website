import { BlogServiceAPI } from "./blog-service-infrastructure"
import { DomainInfrastructure } from './domain-infrastructure'

export const domainInfrastructureService = new DomainInfrastructure("DomainInfrastructure", {})

const certArn = domainInfrastructureService.certificateArn

export const blogServiceAPI = new BlogServiceAPI("BlogServiceAPI", {})
