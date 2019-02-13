const AWS = require('aws-sdk')
const tournament = require('../dataAccess/tournament')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const getTournamentName = {
    TableName: 'tournaBot-currentTournament',
    KeyConditionExpression: 'channelID = :channelID',
    ExpressionAttributeValues: {
      ':channelID': data.channelID
    }
  }

  const nameResult = await documentDB.query(getTournamentName).promise()

  if (nameResult.Count !== 1) throw new { err: `No current tournament set for channel <#${data.channelID}>.` }()

  let tournamentName = nameResult.Items[0].tournamentName

  let savedTournament = await tournament.get(tournamentName)

  console.log(JSON.stringify(savedTournament))

  if (!savedTournament.players) savedTournament.players = []

  data.players.forEach(player => {
    if (savedTournament.players.findIndex(currentPlayer => player === currentPlayer) === -1) savedTournament.players.push(player)
  })

  console.log(JSON.stringify(savedTournament))

  await tournament.addOrUpdate(savedTournament)

  return `Added players: ${data.players}, current players: ${savedTournament.players}`
}

module.exports = { execute }
