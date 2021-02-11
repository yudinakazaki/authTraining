require('dotenv').config()

module.exports = () => {
  if(!process.env.JWTSIGNKEY){
    throw new Error('FATAL ERROR: JWTSIGNKEY is no defined!')
  }
}