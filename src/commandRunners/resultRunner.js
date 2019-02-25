const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let savedTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let matchFound = false
  savedTournament.rounds[savedTournament.currentRound - 1].matches.forEach(match => {
    //Find match and set result
    if (data.player1 === match.player1 && data.player2 === match.player2) {
      match.score.player1 = data.player1Score
      match.score.player2 = data.player2Score
      matchFound = true
    }
    
    // Handle players the wrong way around
    if (data.player2 === match.player1 && data.player1 === match.player2) {
      match.score.player1 = data.player2Score
      match.score.player2 = data.player1Score
      matchFound = true
    }
  });

  if (!matchFound) throw new Error(`no current match found in tournament: ${savedTournament.tournamentName}, in channel: <#${data.channelID}> for players: ${data.player1} and ${data.player2}`)
  
  await tournament.set(savedTournament)
}

module.exports = { execute }