const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  await currentTournament.set({ channelID: `${data.teamID}${data.channelID}`, tournamentName: data.tournamentName })

  return `${data.tournamentName} is now the current tournament in this channel.`
}

module.exports = { execute }
