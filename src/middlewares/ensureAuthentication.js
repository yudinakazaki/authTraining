const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const token = request.header('x-auth-token')
  if(!token) return response.status(401).send('You need to be logged to do it!')

  try{
    const decoded = jwt.verify(token, process.env.JWTSIGNKEY)
    request.user = decoded
    next()
  } catch {
    return response.status(400).send('Invalid token!')
  }

}