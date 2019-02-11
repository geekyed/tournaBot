const help = `new, create a new tournament e.g. /tournaBot new -n <myTourna>, -r <3>\n
current, set the current tournament e.g. /tournaBot current <myTourna>\n`

const parse = async (event) => {
  const command = event.text.split(' ')[0]
  let parameters = stripCommand(event.text)

  switch (command) {
    case 'new':
      return parseNewTournament(parameters)
    case 'current':
      return parseCurrentTournament(parameters, event.channel_id)
    default:
      return { command: { help: help }, err: null }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parseCurrentTournament = (parameters, channelID) => {
  try {
    return { command: { setCurrent: { tournamentName: parameters[0], channelID } } }
  } catch (err) {
    return { command: null, err: 'current command invalid try: /tourneyBot current mytournament' }
  }
}

const parseNewTournament = (parameters) => {
  let name = null
  let rounds = null
  try {
    name = parameters[parameters.findIndex(param => param === '-n') + 1]
    rounds = parameters[parameters.findIndex(param => param === '-r') + 1]

    if (!isNormalInteger(rounds) || rounds < 3) return { command: null, err: 'rounds not found or too small.' }
    if (!/\S/.test(name)) return { command: null, err: 'name not found' }
  } catch (err) {
    return { command: null, err: 'new command invalid try: /tourneyBot new -n mytournament -r 4' }
  }
  return { command: { tournament: { create: { name, rounds } } }, err: null }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }
