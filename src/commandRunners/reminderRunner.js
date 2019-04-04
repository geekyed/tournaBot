const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)
  if (myTournament.rounds.length === 0) throw new Error(`The tournament ${myTournament.tournamentName} hasn't been started yet!`)

  let message = ''
  myTournament.rounds[myTournament.currentRound - 1].matches.forEach(match => {
    if (!match.completed) message += `${match.player1} vs ${match.player2}\n`
  });

  return { header: `Unplayed matches in round ${myTournament.currentRound}`, message } 
}

module.exports = { execute }