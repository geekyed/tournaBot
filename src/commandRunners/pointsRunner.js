const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  
  return JSON.stringify(myTournament)
}
module.exports = { execute }