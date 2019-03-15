const execute = async () => {
  return 'If two players end a swiss tournament with equal points their position is determined by three tiebreak conditions, if one cannot find a winner we use the next rule.\n\n' +
  '   1. Opponents Match Win Percentage - this the the averge win percentage of matches your opponent has.\n' +
  '   2. Your Game Win Percentage - of the games you played what percentage did you win.\n' +
  '   3. Opponents Game Win Percentage - as above but an average of your opponents game win percentage.\n\n' +
  '  see https://www.wizards.com/dci/downloads/tiebreakers.pdf for more info.'
}
module.exports = { execute }