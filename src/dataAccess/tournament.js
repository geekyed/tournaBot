const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()

const execute = (command) => {
  if (command.new) return createNewTournament(command.new)
}

const createNewTournament = async (name, rounds) => {
  await dynamodb.putItem({
    TableName: 'tournaBot-tournaments',
    Item: {
      'name': name,
      'rounds': rounds
    }
  }, (err, data) => {
    if (err) {
      console.log(err, err.stack)
    } else {
      return `Tournament created named ${name}, with ${rounds} rounds.`
    }
  }
  ).promise()
}

module.exports = { execute }
