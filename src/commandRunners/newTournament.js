
const tournament = require('../dataAccess/tournament')

const execute = async (data) => {
  await tournament.set({ tournamentName: data.tournaName, rounds: data.rounds })
  return `${data.tournaName} tournament started, with ${data.rounds} rounds.`
}

module.exports = { execute }
