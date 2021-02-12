const express = require('express')
const winston = require('winston')

const app = express()

require('./startup/loggings')()
require('./startup/config')()
require('./startup/db')()
require('./startup/routes')(app)

port = process.env.PORT || 3000

if(process.env.NODE_ENV !== 'test'){
  app.listen(port, () => winston.info('Serve is running'))
}

module.exports = app