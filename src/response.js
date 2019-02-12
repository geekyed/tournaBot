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

const createHelpResponse = () => {
  return {
    response_type: 'ephemeral',
    attachments: [
      {
        color: '#4dc6ff',
        title: 'Help!',
        text: helpText,
        fallback: helpText
      }
    ] }
}

const helpText = '*new*: Create a new tournament. `/tournaBot new myTourna 3 rounds` \n' +
'*current*: Set the current tournament `/tournaBot current myTourna`\n' +
'*players*: Add new players `/tournaBot addPlayers @edward.weston @david.hackman`\n'

module.exports = { createErrorResponse, createSuccessResponse, createHelpResponse }
