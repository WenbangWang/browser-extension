'use strict'

const context = require.context('.', true, /\.browser\.spec\.js/)

context.keys().forEach(context)
