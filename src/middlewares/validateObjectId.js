const mongoose = require('mongoose')

module.exports = (request, response, next) => {
  if(!mongoose.Types.ObjectId.isValid(request.params.id))
    return response.status(404).send('Ops, we did not find what you are looking for')

  next()
}