'use strict'

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const port = process.argv[2] || 9090
const app = express()

console.log(`Stub Server starts at ${port}`)

app.use(morgan('dev'))

app.use('/', express.static(path.join(process.cwd(), 'stub')))
app.listen(port)
