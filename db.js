const moviesDb = 'f6c30ff8fd13ae4d7ed0f0b97872653d0444a21c45c4bceedce7a57975b58222'
const { Client } = require('hyperspace')
const Hyperbee = require('hyperbee')
const cuid = require('cuid')

const client = new Client()
const store = client.corestore()
const core = store.get(moviesDb)
const db = new Hyperbee(core, {
  keyEncoding: 'utf-8',
  valueEncoding: 'json'
})

db.ready()
  .then(() => {
    client.replicate(core)
  })

exports.add = async function(movie) {
  return await db.put(cuid(), movie)
}

exports.list = async function() {
  var movies = []
  await new Promise(r => {
    db.createReadStream()
      .on('data', obj => movies.push(obj.value))
      .on('end', r)
  })
  return movies
}