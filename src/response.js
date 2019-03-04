const createErrorResponse = (err) => {
  return {
    response_type: 'ephemeral',
    attachments: [
      {
        color: 'danger',
        text: err,
        fallback: err
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
        fallback: message
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

const helpText = '*new*: Create a new tournament. `/tournaBot new <name>` \n' +
'*current*: Set the current tournament `/tournaBot current <name>`\n' +
'*players*: Add new players `/tournaBot players @edward.weston @david.hackman`\n' +
'*generate*: Generate pairings for the round `/tournaBot generate`\n' +
'*I*: Record results a `/tournaBot I won 2-0` or `/tournaBot I lost 2-1` or \n'

module.exports = { createErrorResponse, createSuccessResponse, createHelpResponse }
