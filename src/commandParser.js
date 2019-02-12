
const parse = async (event) => {
  const command = event.text.split(' ')[0]
  let parameters = stripCommand(event.text)

  switch (command) {
    case 'new':
      return parseNew(parameters)
    case 'current':
      return parseCurrent(parameters, event.channel_id)
    case 'players':
      return parsePlayers(parameters)
    default:
      return { type: 'help', data: { responseURL: event.response_url } }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parsePlayers = (parameters) => {
  return { type: 'players', data: { players: parameters } }
}

const parseCurrent = (parameters, channelID) => {
  try {
    return { type: 'current', data: { tournamentName: parameters[0], channelID } }
  } catch (err) {
    return { error: 'current command invalid try: /tourneyBot current mytournament' }
  }
}

const parseNew = (parameters) => {
  let name = null
  let rounds = null
  try {
    name = parameters[0]
    rounds = parameters[parameters.findIndex(param => param === 'rounds') - 1]

    if (!isNormalInteger(rounds) || rounds < 3) return { err: 'rounds not found or too small.' }
    if (!/\S/.test(name)) return { err: 'name not found' }
  } catch (err) {
    return { error: 'new command invalid try: /tourneyBot new -n mytournament -r 4' }
  }
  return { type: 'newTournament', data: { name, rounds } }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }
