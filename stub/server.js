'use strict'

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const port = process.argv[2] || 9090
const isHttps = process.argv[3] === 'true' || false
const app = express()

console.log(`Stub Server starts at ${port} ${isHttps ? 'on https' : ''}`)

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static(path.join(__dirname)))
app.post('/log', (request, response) => {
  console.log(request.body)
  response.send()
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

