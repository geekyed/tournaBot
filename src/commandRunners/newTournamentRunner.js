
const tournament = require('../dataAccess/tournament')
const currentTournamentRunner = require('./currentTournamentRunner')

const execute = async (data) => {
  const newTournament = { 
    tournamentName: data.name,
    currentRound: 1,
    rounds: [],
    type: data.type
  }

  await tournament.set(newTournament)
  await currentTournamentRunner.execute(data)
  return `${data.name} tournament started and set as current tournament for this channel.`
}

module.exports = { execute }
