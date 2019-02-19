
const tournament = require('../dataAccess/tournament')

const execute = async (data) => {
  const newTournament = { 
    tournamentName: data.tournaName,
    currentRound: 1,
    rounds: []
  }
  
  for (let index = 0; index < data.numberRounds; index++) {
    newTournament.rounds.push({
      matches: []
    })
  }

  await tournament.set(newTournament)
  return `${data.tournaName} tournament started, with ${data.numberRounds} rounds.`
}

module.exports = { execute }
