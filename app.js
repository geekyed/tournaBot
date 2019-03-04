const commandParser = require('./src/commandParser')
const newTournamentRunner = require('./src/commandRunners/newTournamentRunner')
const currentTournamentRunner = require('./src/commandRunners/currentTournamentRunner')
const generateMatchesRunner = require('./src/commandRunners/generateMatchesRunner')
const playersRunner = require('./src/commandRunners/playersRunner')
const resultRunner = require('./src/commandRunners/resultRunner')
const { createErrorResponse, createSuccessResponse, createHelpResponse } = require('./src/response')

const commandRunners = {
  'newTournament': newTournamentRunner,
  'current': currentTournamentRunner,
  'players': playersRunner,
  'generate': generateMatchesRunner,
  'result': resultRunner
}

exports.handler = async (event) => {
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
  const errText = `${err}` + ' try `/tournaBot help`'
  console.log(`ERROR: ${err}, EVENT: ${JSON.stringify(event)}`)
  return createErrorResponse(errText)
}
