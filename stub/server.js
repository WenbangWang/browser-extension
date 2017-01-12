'use strict'

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const port = process.argv[2] || 9090
const app = express()

console.log(`Stub Server starts at ${port}`)

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static(path.join(process.cwd(), 'stub')))
app.post('/log', (request, response) => {
  console.log(request.body)
  response.send()
})
app.listen(port)
