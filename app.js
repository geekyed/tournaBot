const commandParser = require('./src/commandParser')
const newTournament = require('./src/dataAccess/newTournament')
const currentTournament = require('./src/dataAccess/currentTournament')
const addPlayers = require('./src/dataAccess/addPlayers')
const { createErrorResponse, createSuccessResponse, createHelpResponse } = require('./src/response')

const commandRunners = {
  'newTournament': newTournament,
  'current': currentTournament,
  'addPlayers': addPlayers
}

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  let { type, data, error } = await commandParser.parse(event)
  if (error) return handleError(error, event)

  if (type === 'help') return createHelpResponse()

  let result = 'no result?'
  try {
    result = await commandRunners[type].execute(data)
  } catch (err) {
    return handleError(err, event)
  }

  return createSuccessResponse(result)
}

const handleError = (err, event) => {
  const errText = `Error: ${err}, Event: ${JSON.stringify(event)}`
  console.log(errText)
  return createErrorResponse(errText)
}
