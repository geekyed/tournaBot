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
    blocks: [
      {
        color: '#4dc6ff',
        type: 'section',
        text: {
          'type': 'mrkdwn',
          'text': `*Help*\n ${helpText}`
        }
      }
    ]
  }
}

const helpText = '`/tournaBot new myTournament swiss` Create a new tournament\n' +
'`/tournaBot current myTournament` Set the current tournament\n' +
'`/tournaBot players @edward.weston @david.hackman` Add new players\n' +
'`/tournaBot start` Start the tournament\n' +
'`/tournaBot I won 2-0` or `/tournaBot I lost 2-1` or `/tournaBot I drew 1-1` Record a result\n' +
'`/tournaBot round` Finish this round (requires all matches to be complete) and pair the next, or get the final scores!\n' +
'`/tournaBot points`Find out the current points standings\n' +
'`/tournaBot scores` Get the full scores\n' +
'`/tournaBot tiebreak` Explain the tie break numbers\n'

module.exports = { createErrorResponse, createSuccessResponse, createHelpResponse }
