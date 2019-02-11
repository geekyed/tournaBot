const commandParser = require('./src/commandParser')
const tournament = require('./src/dataAccess/tournament')
const currentTournament = require('./src/dataAccess/currentTournament')
const { createErrorResponse, createSuccessResponse, createHelpResponse } = require('./src/response')

const commandRunners = {
  'new': tournament,
  'current': currentTournament
}

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  let { command, err } = await commandParser.parse(event)
  if (err) return handleError(err, event)

  if (command.type === 'help') return createHelpResponse()

  let { result, runnerErr } = await commandRunners[command.type].execute(command)
  if (err) return handleError(runnerErr, event)

  return createSuccessResponse(result)
}

const handleError = (err, event) => {
  const errText = `Error: ${err}, Event: ${JSON.stringify(event)}`
  console.log(errText)
  return createErrorResponse(errText)
}
