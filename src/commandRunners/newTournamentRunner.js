
const tournament = require('../dataAccess/tournament')

const execute = async (data) => {
  const newTournament = { 
    tournamentName: data.tournaName,
    currentRound: 1,
    rounds: []
  }

  await tournament.set(newTournament)
  return `${data.tournaName} tournament started, with ${data.numberRounds} rounds.`
}

module.exports = { execute }
