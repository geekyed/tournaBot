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

  let error = null
  await documentDB.update(params, (err) => { error = err }).promise()
  if (error) return { err: error }

  return { result: `${currentTournament.tournamentName} is now the current tournament in this channel.` }
}

module.exports = { execute }
