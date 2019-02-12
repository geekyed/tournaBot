const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const params = {
    TableName: 'tournaBot-currentTournament',
    Key: {
      channelID: data.channelID
    },
    UpdateExpression: 'set tournamentName = :tournamentName',
    ExpressionAttributeValues: {
      ':tournamentName': data.tournamentName
    },
    ReturnValues: 'UPDATED_NEW'
  }

  await documentDB.update(params).promise()

  return `${data.tournamentName} is now the current tournament in this channel.`
}

module.exports = { execute }
