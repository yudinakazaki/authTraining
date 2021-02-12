require('dotenv').config()
const { User } = require('../../../src/models/users')

const ensureAuthentication = require('../../../src/middlewares/ensureAuthentication')

describe('authentication middleware', () => {
  it('should receive a token and return its properties', () => {
    const user = { isAdmin: true }
    const token = new User(user).generateAuthToken()

    const request = {
      header: jest.fn().mockReturnValue(token)
    }
    const response = {}
    const next = jest.fn()
    
    ensureAuthentication(request, response, next)

    expect(request.user).toMatchObject(user)
  })
})