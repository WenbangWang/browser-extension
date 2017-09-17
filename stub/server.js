'use strict'

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const port = process.argv[2] || 9090
const isHttps = process.argv[3] === 'true' || false
const app = express()

const storage = {}

console.log(`Stub Server starts at ${port} ${isHttps ? 'on https' : ''}`)

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/log', (request, response) => {
  console.log(`Log Received on ${new Date()}`, JSON.stringify(request.body, null, 2))
  response.send()
})

app.get('/api', (request, response) => {
  response.send('test')
})

app.post('/storage', (request, response) => {
  const pair = request.body
  Object.keys(pair).forEach(key => (storage[key] = pair[key]))

  response.send()
})

app.get('/storage', (request, response) => {
  const data = {}
  const keys = request.query.key

  if (keys instanceof Array) {
    keys.forEach(key => {
      data[key] = storage[key]
    })
  } else if (typeof keys === 'string') {
    data[keys] = storage[keys]
  }

  response.json(data)
})

if (isHttps) {
  const https = require('https')
  const fs = require('fs')
  const options = {
    key: fs.readFileSync(path.join(__dirname, './server.key')),
    cert: fs.readFileSync(path.join(__dirname, './server.crt'))
  }
  https.createServer(options, app).listen(port)
} else {
  app.listen(port)
}
