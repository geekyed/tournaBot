const tournament = require('../dataAccess/tournament')
const currentTournament = require('../dataAccess/currentTournament')

const execute = async (data) => {
  const tournamentChannelLink = await currentTournament.get(data.channelID)

  let savedTournament = await tournament.get(tournamentChannelLink.tournamentName)

  //const totalRounds = getTotalRounds(savedTournament.players.length)

  // If it's the first round we need to intialise the rounds array.
  if (savedTournament.currentRound === 1) savedTournament.rounds = []

  let round = savedTournament.rounds.length >= 1 ?
    savedTournament.rounds[savedTournament.currentRound - 1] :
    { matches:[], started: false }

  if (round.started) {
    throw new Error(`You cant regenerate matches for round ${savedTournament.currentRound}, as results have already been recorded!`)
  }

  let players = savedTournament.players.slice() // Copy players array.
  let matchesString = `Round ${savedTournament.currentRound} matches generated!\n`
  while (players.length !== 0) {
    const { player1, player2 } = generatePairing(savedTournament.currentRound, players)
    let newMatch = {
      player1,
      player2,
      completed: player2 === 'Bye',
      score: {
        player1: 0,
        player2: 0
      }
    }
    matchesString += `${newMatch.player1} vs ${newMatch.player2}\n`
    round.matches.push(newMatch)
  }
  
  await tournament.set(savedTournament)

  return matchesString
}

const generatePairing = (roundNumber, players) =>  {
  if (roundNumber === 1 ) {
    return { 
      player1: popRandomElement(players), 
      player2: popRandomElement(players)
    }
  }
  return { 
    player1: 0, 
    player2: 0
  }
}

const popRandomElement = (players)=> {
  if(players.length === 0) return 'Bye'
  const playerIndex = Math.floor(Math.random() * players.length)
  return players.splice(playerIndex, 1)[0]
}

const getTotalRounds = (numPlayers) => {
  if (numPlayers <= 2) return 1
  if (numPlayers <= 4) return 2
  if (numPlayers <= 8) return 3
  if (numPlayers <= 16) return 4
  if (numPlayers <= 32) return 5
  if (numPlayers <= 64) return 6
  if (numPlayers <= 128) return 7
  throw new Error(`Not sure how many rounds to generate!`)
}

module.exports = { execute }
