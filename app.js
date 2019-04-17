const commandParser = require('./src/commandParser')
const newTournamentRunner = require('./src/commandRunners/newTournamentRunner')
const currentTournamentRunner = require('./src/commandRunners/currentTournamentRunner')
const generateMatchesRunner = require('./src/commandRunners/generateMatchesRunner')
const playersRunner = require('./src/commandRunners/playersRunner')
const resultRunner = require('./src/commandRunners/resultRunner')
const scoresRunner = require('./src/commandRunners/scoresRunner')
const pointsRunner = require('./src/commandRunners/pointsRunner')
const roundRunner = require('./src/commandRunners/roundRunner')
const tiebreakRunner = require('./src/commandRunners/tiebreakRunner')
const reminderRunner = require('./src/commandRunners/reminderRunner')
const { createEphemeralResponse, createResponse, createHelpResponse } = require('./src/slackResponse')

const commandRunners = {
  'newTournament': newTournamentRunner,
  'current': currentTournamentRunner,
  'players': playersRunner,
  'generate': generateMatchesRunner,
  'result': resultRunner,
  'scores': scoresRunner,
  'points': pointsRunner,
  'round': roundRunner,
  'tiebreak': tiebreakRunner,
  'reminder': reminderRunner
}

exports.handler = async (event) => {
  let { type, data, error } = await commandParser.parse(event)
  if (error) return handleError(error, event)

  if (type === 'help') return createHelpResponse()

  try {
    let { header, message, imageURL } = await commandRunners[type].execute(data)
    return createResponse(header, message, imageURL)
  } catch (err) {
    return handleError(err, event)
  }
}

const handleError = (err, event) => {
  const errText = `${err}` + ' try `/tournaBot help`'
  console.log(`ERROR: ${err}, EVENT: ${JSON.stringify(event)}`)
  return createEphemeralResponse('Error', errText)
}
