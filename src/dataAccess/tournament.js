const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const get = async (tournamentName) => {
  const getTournament = {
    TableName: 'tournaBot-tournaments',
    KeyConditionExpression: 'tournamentName = :tournamentName',
    ExpressionAttributeValues: {
      ':tournamentName': tournamentName
    }
  }

  const getTournamentResult = await documentDB.query(getTournament).promise()

  if (getTournamentResult.Count !== 1) throw new { err: `tournament (${tournamentName} not found` }()

  return getTournamentResult.Items[0]
}

const addOrUpdate = async (tournament) => {
  const params = {
    TableName: 'tournaBot-tournaments',
    Item: tournament
  }

  await documentDB.put(params).promise()
}

module.exports = { get, addOrUpdate }
