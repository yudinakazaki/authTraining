const request = require('supertest')
const { User } = require('../../../src/models/users')

describe('ensure authentication', () => {
  let token
  let server

  beforeEach(async () => {
    server = require('../../../src/server')
    token = new User().generateAuthToken()
  })

  const exec = () => {
    return request(server)
      .get('/api/profile')
      .set('x-auth-token', token)
      .send()
  }

  it('should return 401 if no token is provided', async () => {
    token = ''

    const response = await exec()

    expect(response.status).toBe(401)
  })

  it('should return 400 if token is invalid', async () => {
    token = 1

    const response = await exec()

    expect(response.status).toBe(400)
  })

  it('should return 200 if the token is valid', async () => {
    const response = await exec()

    expect(response.status).toBe(200)  
  })
})