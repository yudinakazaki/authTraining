require('winston-mongodb')
require('express-async-errors')
const winston = require('winston')


module.exports = () => {
  winston.add(new winston.transports.File({ filename: 'logfile.log'}))
  winston.add(new winston.transports.MongoDB({
    db: 'mongodb://localhost/auth-training',
    level: 'info'
  }))

  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  )

  process.on('unhandledRejection', ex => {
    winston.error(ex.message)
    process.exit(1)
  })
}