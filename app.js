const commandParser = require('./src/commandParser')
const tournament = require('./src/dataAccess/tournament')
const currentTournament = require('./src/dataAccess/currentTournament')

// const commandRunners = [tournament, currentTournament]

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  const { command, err } = await commandParser.parse(event)

  if (err) return createErrorResponse(`Error: ${err}, Command sent: ${event.text}`)

  let result = null
  try {
    // await commandRunners.foreach(async runner => { if (!result) result = await runner.execute(command) })
    if (!result) result = await tournament.execute(command)
    if (!result) result = await currentTournament.execute(command)
  } catch (error) {
    return createErrorResponse(error)
  }

  if (!result) return createHelpResponse(command.help)

  return createSuccessResponse(result)
}

const createErrorResponse = (err) => {
  return {
    response_type: 'ephemeral',
    attachments: [
      {
        color: 'danger',
        text: err,
        fallback: err,
        footer: `tourneyBot`,
        ts: Date.now() / 1000
      }
    ] }
}

const createSuccessResponse = (message) => {
  return {
    response_type: 'in_channel',
    attachments: [
      {
        color: 'good',
        text: message,
        fallback: message,
        footer: `tourneyBot`,
        ts: Date.now() / 1000
      }
    ] }
}

const createHelpResponse = (message) => {
  return {
    response_type: 'ephemeral',
    attachments: [
      {
        color: 'good',
        title: 'tourneyBot help',
        text: message,
        fallback: message,
        footer: `tourneyBot`,
        ts: Date.now() / 1000
      }
    ] }
}
