
const tournament = require('../dataAccess/tournament')
const currentTournamentRunner = require('./currentTournamentRunner')

const execute = async (data) => {
  const newTournament = { 
    tournamentName: data.tournamentName,
    currentRound: 1,
    rounds: []
  }

  await tournament.set(newTournament)
  await currentTournamentRunner.execute(data)
  return `${data.tournamentName} tournament started and set as current tournament for this channel.`
}

module.exports = { execute }
