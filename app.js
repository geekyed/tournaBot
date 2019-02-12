const commandParser = require('./src/commandParser')
const newTournament = require('./src/commandRunners/newTournament')
const currentTournament = require('./src/commandRunners/currentTournament')
const addPlayers = require('./src/commandRunners/addPlayers')
const { createErrorResponse, createSuccessResponse, createHelpResponse } = require('./src/response')

const commandRunners = {
  'newTournament': newTournament,
  'current': currentTournament,
  'addPlayers': addPlayers
}

exports.handler = async (event) => {
  let { type, data, error } = await commandParser.parse(event)
  if (error) return handleError(error, event)

  if (type === 'help') return createHelpResponse()

  let result = 'no result?'
  try {
    console.log(type, data)
    result = await commandRunners[type].execute(data)
  } catch (err) {
    return handleError(err, event)
  }

  return createSuccessResponse(result)
}

const handleError = (err, event) => {
  const errText = `Error: ${err}, ` + 'try `/tournaBot help`'
  console.log(err)
  return createErrorResponse(errText)
}
