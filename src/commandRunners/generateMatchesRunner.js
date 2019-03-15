const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')
const { collateTotalScores } = require('./helpers/collateTotalScores')
const scoresRunner = require('./scoresRunner')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)
  let myTournament = await tournament.get(tournamentChannelLink.tournamentName)

  if (isRoundStarted(myTournament)) {
    throw new Error('You cannot regenerate a round once a match has been played.')
  }

  let round = {}

  switch (myTournament.type) {
    case 'swiss':
      round = generateSwissRound(myTournament)
      break
    case 'knockout':
      round = generateKnockoutRound(myTournament)
      break
  }

  myTournament.rounds[myTournament.currentRound - 1] = round
  await tournament.set(myTournament)

  return await scoresRunner.execute(data)
}

const generateKnockoutRound = (myTournament) => {
  let round = { matches:[], started: false }

  let pairingsList = myTournament.players.slice()
  
  if (myTournament.currentRound === 1) pairingsList.sort(() => {return 0.5 - Math.random()}) //Randomise the pairings

  while (pairingsList.length !== 0) {
    const player1 = pairingsList.pop()
    const player2 = pairingsList.length !== 0 ? pairingsList.pop() : 'Bye'

    round.matches.push(createMatch(player1, player2))
  }
  return round
}

const generateSwissRound = (myTournament) => {
  let round = initialiseSwissRound(myTournament)
  let totalScores = collateTotalScores(myTournament)
  if (myTournament.currentRound === 1) totalScores.sort(() => {return 0.5 - Math.random()}) //Randomise the first round.

  while (totalScores.length !== 0) {
    const player1 = totalScores.pop()
    const player2 = getPlayer2(player1, totalScores, myTournament.rounds)

    round.matches.push(createMatch(player1.name, player2.name))
    if (player2.name === 'Bye') round.points[player1.name] = 3
  }
  return round
}

const getPlayer2 = (player1, totalScores, rounds) => {
  // P1 is last in the bunch so gets a bye.
  if (totalScores.length === 0) return { name: 'Bye', points: 0 }
  
  let p2Index = totalScores.length - 1
  // players cant play twice
  while (playersHavePlayed(player1.name, totalScores[p2Index].name, rounds)) {
    p2Index--
    if(p2Index < 0) throw new Error(`Somethings gone wrong ${player1.name} has played everyone`)
  }

  return totalScores.splice(p2Index, 1)[0]
}

const playersHavePlayed = (player1Name, player2Name, rounds) => {
  for(let i = 0; i < rounds.length; i++) {
    if (getPlayersMatchIndexForRound(player1Name, rounds[i]) === getPlayersMatchIndexForRound(player2Name, rounds[i])) return true
  }
  return false
}

const getPlayersMatchIndexForRound = (playerName, round) => round.matches.findIndex(match => match.player1 === playerName || match.player2 === playerName)

const initialiseSwissRound = (myTournament) => {
  let round = { matches:[], started: false, points: {} }
  for (let i in myTournament.players) round.points[myTournament.players[i]] = 0
  return round
}

const isRoundStarted = (myTournament) => {
  const roundIndex = myTournament.currentRound - 1
  return typeof myTournament.rounds[roundIndex] !== 'undefined' && myTournament.rounds[roundIndex].started
}

const createMatch = (player1Name, player2Name) => {
  return newMatch = {
    player1: player1Name,
    player2: player2Name,
    completed: player2Name === 'Bye',
    score: {
      player1: 0,
      player2: 0
    }
  }
}


module.exports = { execute }
