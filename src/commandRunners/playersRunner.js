const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (myTournament.rounds.length > 0 && myTournament.rounds[0].started) throw new Error('You can\'t add players to a started tournament!')

  if (!myTournament.players) myTournament.players = []

  data.players.forEach(player => {
    if (!elementIsInArray(player, myTournament.players)) {
      myTournament.players.push(player)
    }
  })

  await tournament.set(myTournament)

  return `Added players:${buildFormattedPlayers(data.players)}\nCurrent players:${buildFormattedPlayers(myTournament.players)}`
}

const buildFormattedPlayers = (players) => {
  let formatted = ''
  players.forEach(player => {
    formatted += ` ${player}`
  })
  return formatted
}

const elementIsInArray = (myElement, myArray) => {
  return (myArray.findIndex(el => el === myElement) !== -1)
}
module.exports = { execute }
