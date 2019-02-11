const commandParser = require('./src/commandParser')
const newTournament = require('./src/dataAccess/newTournament')
const currentTournament = require('./src/dataAccess/currentTournament')
const { createErrorResponse, createSuccessResponse, createHelpResponse } = require('./src/response')

const commandRunners = {
  'new': newTournament,
  'current': currentTournament
}

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  let { type, data, err } = await commandParser.parse(event)
  if (err) return handleError(err, event)

  if (type === 'help') return createHelpResponse()

  let { result, runnerErr } = await commandRunners[type].execute(data)
  if (err) return handleError(runnerErr, event)

  return createSuccessResponse(result)
}

const handleError = (err, event) => {
  const errText = `Error: ${err}, Event: ${JSON.stringify(event)}`
  console.log(errText)
  return createErrorResponse(errText)
}
