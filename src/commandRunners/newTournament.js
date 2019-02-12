const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const params = {
    TableName: 'tournaBot-tournaments',
    Item: { tournaName: data.tournaName, rounds: data.rounds }
  }

  await documentDB.put(params).promise()

  return `${data.tournaName} tournament started, with ${data.rounds} rounds.`
}

module.exports = { execute }
