const collateTotalScores = (tournament) => {
  let totalScores = []
  let points = {}
  let matchWinPercentage = {}
  let gameWinPercentage = {}
  let opponents = {}

  tournament.players.forEach( name => {
    let gamePoints = 0
    let gamesPlayed = 0
    points[name] = 0
    opponents[name] = []

    tournament.rounds.forEach( round => {
      points[name] += round.points[name]
      let match = round.matches.find(match => match.player1 === name || match.player2 === name)
      gamesPlayed += match.score.player1 + match.score.player2
      if (match.player1 === name) {
        gamePoints += (3 * match.score.player1)
        opponents[name].push(match.player2)
      }
      if (match.player2 === name) {
        gamePoints += (3 * match.score.player2)
        opponents[name].push(match.player1)
      }
      //  Drawn last game assumed if 1-1
      if (match.score.player1 === match.score.player2) {
        gamePoints += 1
        gamesPlayed += 1
      }
    })
    matchWinPercentage[name] = (points[name] / (tournament.rounds.length * 3)) * 100 
    gameWinPercentage[name] = (gamePoints / (gamesPlayed * 3)) * 100
  })

  tournament.players.forEach( name => {
    let oppMatchWinTot = 0
    opponents[name].forEach( opponent => oppMatchWinTot += matchWinPercentage[opponent] )
    const oppMatchWinPerc = oppMatchWinTot / opponents[name].length
    totalScores.push({ name, points: points[name], oppMatchWinPerc, gameWinPerc: gameWinPercentage[name] })
  })

  return totalScores.sort((a, b) => {
    if (a.points === b.points) {
      if (a.oppMatchWinPerc === b.oppMatchWinPerc) {
        if (a.gameWinPerc === b.gameWinPerc) {
          return 0
        }
        return a.gameWinPerc - b.gameWinPerc
      }
      return a.oppMatchWinPerc - b.oppMatchWinPerc
    }
    return a.points - b.points
  })
}


module.exports = { collateTotalScores }
