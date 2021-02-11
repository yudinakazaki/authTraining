const winston = require('winston')

module.exports = (err, request, response, next) => {
  winston.error(err.message)

  return response.status(500).send('Sorry, something failed.')
}