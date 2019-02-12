const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const params = {
    TableName: 'tournaBot-tournaments',
    Item: { name: data.name, rounds: data.rounds }
  }

  await documentDB.put(params).promise()

  return `${data.name} tournament started, with ${data.rounds} rounds.`
}

module.exports = { execute }
