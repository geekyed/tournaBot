const AWS = require('aws-sdk')
const documentDB = new AWS.DynamoDB.DocumentClient()

const execute = async (data) => {
  const params = {
    TableName: 'tournaBot-tournaments',
    Item: { name: data.name, rounds: data.rounds }
  }

  console.log(`SAVING NEW TOURNAMENT: ${JSON.stringify(params)}`)

  let error = null
  await documentDB.put(params, (err) => { error = err }).promise()
  if (error) return { err: error }

  return { result: `${data.name} tournament started, with ${data.rounds} rounds.` }
}

module.exports = { execute }
