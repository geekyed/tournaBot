
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
      return { command: { help: { responseURL: event.response_url }, type: 'help' } }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parsePlayers = (parameters) => {
  return { command: { players: parameters, type: 'players' } }
}

const parseCurrent = (parameters, channelID) => {
  try {
    return { command: { setCurrent: { tournamentName: parameters[0], channelID }, type: 'current' } }
  } catch (err) {
    return { command: null, err: 'current command invalid try: /tourneyBot current mytournament' }
  }
}

const parseNew = (parameters) => {
  let name = null
  let rounds = null
  try {
    name = parameters[0]
    rounds = parameters[parameters.findIndex(param => param === 'rounds') - 1]

    if (!isNormalInteger(rounds) || rounds < 3) return { command: null, err: 'rounds not found or too small.' }
    if (!/\S/.test(name)) return { command: null, err: 'name not found' }
  } catch (err) {
    return { command: null, err: 'new command invalid try: /tourneyBot new -n mytournament -r 4' }
  }
  return { command: { tournament: { create: { name, rounds } }, type: 'new' }, err: null }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }
