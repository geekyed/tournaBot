const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const params = {
    TableName: 'tournaBot-data',
    Key: {
      channelID: data.channelID
    },
    UpdateExpression: 'set tournamentName = :tournamentName',
    ExpressionAttributeValues: {
      ':tournamentName': data.tournamentName
    },
    ReturnValues: 'UPDATED_NEW'
  }
  console.log(`SETTING CURRENT TOURNAMENT: ${JSON.stringify(params)}`)

  let error = null
  await documentDB.update(params, (err) => { error = err }).promise()
  if (error) return { err: error }

  return { result: `${data.tournamentName} is now the current tournament in this channel.` }
}

module.exports = { execute }
