const collateTotalScores = (tournament) => {
  let totalScores = []
  for (let i in tournament.players) {
    let points = 0
    for (let j in tournament.rounds) {
      points += tournament.rounds[j].points[tournament.players[i]]
    }
    totalScores.push({ name: tournament.players[i], points })
  }
  return totalScores.sort((a, b) => a.points - b.points)
}

module.exports = { collateTotalScores }
