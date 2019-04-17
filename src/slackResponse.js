const createEphemeralResponse = (header, message, imageURL) => {
  let response =  {
    response_type: 'ephemeral',
    blocks: []
  }

  return createBlocks(response, header, message, imageURL)
}

const createHelpResponse = () => {
  let response = {
    response_type: 'ephemeral',
    blocks: []
  }
  return createBlocks(response, 'help', helpText)
}

const createResponse = (header, message, imageURL) => {
  let response =  {
    response_type: 'in_channel',
    blocks: []
  }

  return createBlocks(response, header, message, imageURL)
}

const createBlocks = (response, header, message, imageURL) => {
  if (header) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*' + header + '*'
      }
    })
  }
  if (message) {
    response.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message
      }
    })
  }
  if (imageURL) {
    response.blocks.push({
      type: 'image',
      image_url: imageURL,
      alt_text: 'an image'
    })
  }
  return response
}

const helpText = '`/tournaBot new myTournament swiss` Create a new tournament\n' +
'`/tournaBot current myTournament` Set the current tournament\n' +
'`/tournaBot players @edward.weston @david.hackman` Add new players\n' +
'`/tournaBot start` Start the tournament\n' +
'`/tournaBot I won 2-0` or `/tournaBot I lost 2-1` or `/tournaBot I drew 1-1` Record a result\n' +
'`/tournaBot round` Finish this round (requires all matches to be complete) and pair the next, or get the final scores!\n' +
'`/tournaBot points`Find out the current points standings\n' +
'`/tournaBot scores` Get the full scores\n' +
'`/tournaBot tiebreak` Explain the tie break numbers\n' +
'`/tournaBot reminder` Remind players that havent played their games yet to get a move on.\n'

module.exports = { createEphemeralResponse, createResponse, createHelpResponse }
