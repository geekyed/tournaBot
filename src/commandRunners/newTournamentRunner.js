
const tournament = require('../dataAccess/tournament')
const currentTournamentRunner = require('./currentTournamentRunner')

const execute = async (data) => {
  const currentTournament = await tournament.get(data.name)

  if (currentTournament) return `${data.name} tournament already exists, choose a different name or talk to an admin.`

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
