const help = `tournaBot help!\n
new, create a new tournament e.g. /tourneyBot new named <name>, 3 rounds\n`

const parse = async (event) => {
  const command = event.text.split(' ')[0]
  const parameters = stripCommand(event.text)

  switch (command) {
    case 'new':
      return parseNew(parameters)
    default:
      return { command: { help: help }, err: null }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parseNew = (parameters) => {
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
  return { command: { new: { name, rounds } }, err: null }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }
