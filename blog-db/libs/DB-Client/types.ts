import nconf from 'nconf'

export interface DBClientConfiguration
{
    db: AWS.DynamoDB
    items: typeof nconf
}