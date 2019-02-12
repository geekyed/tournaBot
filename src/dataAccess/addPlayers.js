const AWS = require('aws-sdk')
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

  console.log(nameResult)

  const tournamentName = nameResult.Items[0].tournamentName

  const getTournament = {
    TableName: 'tournaBot-tournaments',
    KeyConditionExpression: 'tournaName = :tournamentName',
    ExpressionAttributeValues: {
      ':tournamentName': tournamentName
    }
  }

  const getTournamentResult = await documentDB.query(getTournament).promise()

  console.log(getTournamentResult)

  if (getTournamentResult.Count !== 1) throw new { err: `This tournament (${tournamentName} doesnt exist have you created it yet?` }()

  let currentPlayers = getTournamentResult.Items[0].players

  if (!currentPlayers) currentPlayers = []

  console.log(`Current Players ${currentPlayers}`)

  data.players.forEach(player => {
    currentPlayers.push(player)
  })

  console.log(`NEW Current Players ${currentPlayers}`)

  const updatePlayers = {
    TableName: 'tournaBot-tournaments',
    Key: {
      tournaName: tournamentName
    },
    UpdateExpression: 'set players = :players',
    ExpressionAttributeValues: {
      ':players': currentPlayers
    },
    ReturnValues: 'UPDATED_NEW'
  }

  await documentDB.update(updatePlayers).promise()

  return `Added players: ${data.players}, current players: ${currentPlayers}`
}

module.exports = { execute }
