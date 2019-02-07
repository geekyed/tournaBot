const AWS = require('aws-sdk')
const sns = new AWS.SNS()

const snsARN = 'arn:aws:sns:eu-west-1:662182053957:tournaBot'

exports.handler = async (event) => {
  const eventText = JSON.stringify(event, null, 2)
  console.log('Received event:', eventText)

  const command = event.text.split(' ')[0]
  const parameters = stripCommand(event.text)
  let err = null

  switch (command) {
    case 'help':
      return getHelpText(parameters)
    case 'new':
      err = await createNewTournament(parameters)
      break
    default:
      return createErrorResponse('No valid command found try: help')
  }

  if (err) return createErrorResponse(`Error: ${err}, Command sent: ${event.text}`)

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

const getHelpText = () => {
  return {
    text: `tournaBot help!\n
           new, create a new tournament e.g. /tourneyBot new named <name>, 3 rounds\n`,
    response_type: 'ephemeral'
  }
}

const createNewTournament = async (parameters) => {
  let name = null
  let rounds = null
  try {
    console.log(parameters)
    name = parameters[parameters.findIndex(param => param === '-n') + 1]
    rounds = parameters[parameters.findIndex(param => param === '-r') + 1]

    console.log(`NAME: ${name}`)
    console.log(`ROUNDS: ${rounds}`)

    if (!isNormalInteger(rounds) || rounds < 3) return 'rounds not found or too small.'
    if (!/\S/.test(name)) return 'name not found'
  } catch (err) {
    return 'new command invalid try: /tourneyBot new -n mytournament -r 4'
  }

  const command = { command: 'new', data: { name, rounds } }

  await publish(JSON.stringify(command))
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

const publish = async (message) => {
  return sns.publish({
    Message: message,
    TopicArn: snsARN
  }).promise()
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
