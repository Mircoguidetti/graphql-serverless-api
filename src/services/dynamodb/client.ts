const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-1' })

export const dynamoDB = new AWS.DynamoDB.DocumentClient()
