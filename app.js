
exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  const command = event.text.split(' ')[0]

  switch (command) {
    case 'new':
      createNewTournament(stripCommand(event.text))
      break
    default:
      return createErrorResponse('No valid command found try: help')
  }

  return {
    text: `tournaBot command ${event.text} received!`,
    response_type: 'in_channel'
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const createNewTournament = async (parameters) => {
  // tournament created!
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
