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
'*start*: Start the tournament `/tournaBot start`\n' +
'*I*: Record results a `/tournaBot I won 2-0` or `/tournaBot I lost 2-1` or I drew 1-1 \n' +
'*round*: Finish this round (requires all matches to be complete) and pair the next, or get the final scores! `/tournaBot round` \n' +
'*points*: Find out the current points standings. `/tournaBot points`\n' +
'*scores*: Get the full scores breakdown. `/tournaBot scores`\n' +
'*tiebreak*: Explain the tie break numbers. `/tournaBot tiebreak`\n'

module.exports = { createErrorResponse, createSuccessResponse, createHelpResponse }
