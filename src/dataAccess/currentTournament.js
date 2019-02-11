const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (command) => {
  if (!command.setCurrent) return

  return setCurrentTournament(command.setCurrent)
}

const setCurrentTournament = async (currentTournament) => {
  const params = {
    TableName: 'tournaBot-currentTournament',
    Key: {
      channelID: currentTournament.channelID
    },
    UpdateExpression: 'set tournamentName = :tournamentName',
    ExpressionAttributeValues: {
      ':tournamentName': currentTournament.tournamentName
    },
    ReturnValues: 'UPDATED_NEW'
  }
  console.log(`SETTING CURRENT TOURNAMENT: ${JSON.stringify(params)}`)
  await documentDB.update(params, (err) => { console.log(err) }).promise()
  return `${currentTournament.tournamentName} is now the current tournament.`
}

module.exports = { execute }
