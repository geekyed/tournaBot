const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  let matches = myTournament.rounds[myTournament.currentRound - 1].matches

  for (let i = 0; i < matches.length; i++ ) {
    // Is user player 1 of this match?
    if (matches[i].player1.includes(data.userID)) {
      matches[i].score.player1 = data.score.user
      matches[i].score.player2 = data.score.opponent
      return await saveTournament(myTournament, data)
    }
    // Is user player 2 of this match?
    if (matches[i].player2.includes(data.userID)) {
      matches[i].score.player1 = data.score.opponent
      matches[i].score.player2 = data.score.user
      return await saveTournament(myTournament, data)
    }
  }

  throw new Error(`no current match found in tournament: ${myTournament.tournamentName}, 
    in channel: <#${data.channelID}> for player: <@${data.userID}>`)
}

const saveTournament = async (myTournament, data) => {
  myTournament.rounds[myTournament.currentRound - 1].started = true
  await tournament.set(myTournament)
  return createResponse(data.userID, data.score)
}

const createResponse = (user, score) => {
  if (score.user > score.opponent) return `Result saved, congrats on the win <@${user}>!`
  if (score.opponent > score.user) return `Result saved, better luck next time <@${user}>`
  if (score.opponent === score.user) return `Result saved, oh you drew <@${user}>`
}

module.exports = { execute }