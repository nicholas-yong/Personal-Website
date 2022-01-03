## README
This repo contains code relating to my personal website. All of the frontend parts are inside personal-website.
The backend areas are inside blog-service-api and blog-db.

## Personal-Website
React based frontend using NextJS for things like image-loading/bundling/routing.

## Blog-Service-API
Pulumi based IOC that provisions a Lambda/API Gateway/Cloudwatch Log Group to interface with the DynamoDB that is provisioned inside blog-db. It uses the serverless-express framework from Vendia to run express in a serverless fashion.

## Blog-DB
Provisions a DynamoDB table for storing the blog data, as well as a set of queries for performing CRUD operations on the table.

