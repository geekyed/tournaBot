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
      matches[i].completed = true
      return await saveTournament(myTournament, data)
    }
    // Is user player 2 of this match?
    if (matches[i].player2.includes(data.userID)) {
      matches[i].score.player1 = data.score.opponent
      matches[i].score.player2 = data.score.user
      matches[i].completed = true
      return await saveTournament(myTournament, data)
    }
  }

  throw new Error(`no current match found in tournament: ${myTournament.tournamentName}, 
    in channel: <#${data.channelID}> for player: <@${data.userID}>`)
}

const saveTournament = async (myTournament, data) => {
  let rounds = myTournament.rounds[myTournament.currentRound - 1]
  rounds.started = true
  const isRoundFinished = allMatchesCompleted(rounds.matches)
  if (isRoundFinished) myTournament.currentRound++

  await tournament.set(myTournament)
  return createResponse(data.userID, data.score, isRoundFinished)
}

const allMatchesCompleted = (matches) => {
  matches.forEach(match => {
    if (match.completed === false) return false
  })
  return true
}

const createResponse = (user, score, isRoundFinished) => {
  let finished = ''
  if (isRoundFinished) finished = ' The round has finished, use generate to create the next set of pairings'
  if (score.user > score.opponent) response = `Result saved, congrats on the win <@${user}>!${finished}`
  if (score.opponent > score.user) response = `Result saved, better luck next time <@${user}>${finished}`
  if (score.opponent === score.user) response = `Result saved, oh you drew <@${user}>${finished}`
}

module.exports = { execute }