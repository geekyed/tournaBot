const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let savedTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (!savedTournament.players) savedTournament.players = []

  data.players.forEach(player => {
    if (!elementIsInArray(player, savedTournament.players)) {
      savedTournament.players.push(player)
    }
  })

  await tournament.set(savedTournament)

  return `Added players:${buildFormattedPlayers(data.players)}\nCurrent players:${buildFormattedPlayers(savedTournament.players)}`
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
