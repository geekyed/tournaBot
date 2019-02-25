const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const TableName = 'tournaBot-currentTournament'

const get = async (channelID) => {
  const getParams = {
    TableName,
    KeyConditionExpression: 'channelID = :channelID',
    ExpressionAttributeValues: {
      ':channelID': channelID
    }
  }

  const result = await documentDB.query(getParams).promise()

  if (result.Count !== 1) throw new Error(`no current tournament set in <#${channelID}>`)

  return result.Items[0]
}

const set = async (currentTournament) => {
  const params = {
    TableName,
    Item: currentTournament
  }

  await documentDB.put(params).promise()
}

module.exports = { set, get }
