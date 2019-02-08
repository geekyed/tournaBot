const commandParser = require('./src/commandParser')
const tournament = require('./src/dataAccess/tournament')

const commandRunners = [ tournament ]

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  const { command, err } = commandParser.parse(event)

  if (err) return createErrorResponse(`Error: ${err}, Command sent: ${event.text}`)

  console.log(JSON.stringify(command))

  let result = null

  commandRunners.forEach(runner => { if (!result) result = runner.execute(command) })

  if (!result) return helpText(command)

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
    response_type: 'ephemeral',
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
const helpText = (command) => {
  return {
    text: command.help,
    response_type: 'ephemeral'
  }
}
