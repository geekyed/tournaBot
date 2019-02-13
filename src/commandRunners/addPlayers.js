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

  let savedTournament = await tournament.get(nameResult.Items[0].tournamentName)

  if (!savedTournament.players) savedTournament.players = []

  data.players.forEach(player => {
    if (!elementIsInArray(player, savedTournament.players)) {
      savedTournament.players.push(player)
    }
  })

  await tournament.addOrUpdate(savedTournament)

  return `Added players:${buildFormattedPlayers(data.players)}\nCurrent players:${buildFormattedPlayers(savedTournament.players)}`
}

const buildFormattedPlayers = (players) => {
  let formatted = ''
  players.forEach(player => {
    formatted += ` <${player}>`
  })
  return formatted
}

const elementIsInArray = (myElement, myArray) => {
  return (myArray.findIndex(el => el === myElement) !== -1)
}
module.exports = { execute }
