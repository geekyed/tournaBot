
const parse = async (event) => {
  const command = event.text.split(' ')[0]
  let parameters = stripCommand(event.text)

  const channelIdWithTeam = `${event.team_id}-${event.channel_id}`

  switch (command.toLowerCase()) {
    case 'new':
      return parseNew(parameters, channelIdWithTeam)
    case 'current':
      return parseCurrent(parameters, channelIdWithTeam)
    case 'i':
      return parseResult(parameters, channelIdWithTeam, event.user_id)
    case 'players':
      return { type: 'players', data: { players: parameters, channelID: channelIdWithTeam } }
    case 'start':
      return { type: 'generate', data: { channelID: channelIdWithTeam } }
    case 'scores':
      return { type: 'scores', data: { channelID: channelIdWithTeam } }
    case 'points':
      return { type: 'points', data: { channelID: channelIdWithTeam } }
    case 'round':
      return { type: 'round', data: { channelID: channelIdWithTeam } }
    case 'help':
      return { type: 'help' }
    case 'tiebreak':
      return { type: 'tiebreak' }
    default:
      return { error: 'command not found' }
  }
}

const stripCommand = (text) => {
  let parameters = text.split(' ')
  parameters.shift()
  return parameters
}

const parseResult = (parameters, channelID, userID) => {
  let result = { 
    type: 'result', 
    data: { 
      channelID,
      userID,
      score: {
        user: 0,
        opponent: 0
      }
    }
  }

  const splitScore = parameters[1].split('-')
  if (splitScore[0] < splitScore[1]) return { error: `Have you typed your score in the right way around? (Hint: you dont normally say I lost 0-2.)`}

  switch (parameters[0]) {
    case 'won':
      result.data.score.user = splitScore[0]
      result.data.score.opponent = splitScore[1]
      break
    case 'lost':
    case 'drew':
      result.data.score.user = splitScore[1]
      result.data.score.opponent = splitScore[0]
      break
    default:
      return { error: 'did you forget if you won, lost or drew?' }
  }

  if (!isNormalInteger(result.data.score.user) || !isNormalInteger(result.data.score.opponent)) {
    return { error: 'scores are not valid integers' }
  }

  return result
}

const parseCurrent = (parameters, channelID) => {
  try {
    return { type: 'current', data: { name: parameters[0], channelID } }
  } catch (err) {
    return { error: 'current command invalid' }
  }
}

const parseNew = (parameters, channelID) => {
  let name = null
  let type = null
  try {
    name = parameters[0]
    type = parameters[1]
    if (type !== 'swiss' && type !== 'knockout') return { error: 'Invalid tournament type,' }
    if (!/\S/.test(name)) return { error: 'name not found,' }
  } catch (err) {
    return { error: 'new command invalid,' }
  }
  return { type: 'newTournament', data: { name, channelID, type } }
}

const isNormalInteger = (str) => {
  var n = Math.floor(Number(str))
  return n !== Infinity && String(n) === str && n >= 0
}

module.exports = { parse }
