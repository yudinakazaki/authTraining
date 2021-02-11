const express = require('express')

const router = express.Router()

router.get('/', (request, response) => {
  return response.send({message: 'Hello'})
})

module.exports = router