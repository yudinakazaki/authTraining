require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'
})

module.exports = () => {
  if(!process.env.JWTSIGNKEY){
    throw new Error('FATAL ERROR: JWTSIGNKEY is no defined!')
  }
}