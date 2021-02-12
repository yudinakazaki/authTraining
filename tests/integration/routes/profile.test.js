const request = require('supertest')

const { User } = require('../../../src/models/users')
 
describe('/api/profile', () => {
  let server
  let user
  let token

  beforeEach(async () => {
    server = require('../../../src/server')
    
    user = new User({
      name: 'userName',
      email: 'user@gmail.com',
      password: '1234',
      isAdmin: false
    })

    await user.save()

    token = user.generateAuthToken()
  })

  afterEach(async () => User.remove({}))

  describe('GET /', () => {

    const exec = () =>{
      return request(server)
        .get('/api/profile')
        .set('x-auth-token', token)
        .send()
    }

    it('should return 401 client is not logged in', async () => {
      token = ''
      
      const response = await exec()

      console.log()
      expect(response.status).toBe(401)
    })

    it('should return the user', async () => {
      const response = await exec()

      expect(response.body).toHaveProperty('name', user.name)
      expect(response.body).toHaveProperty('email', user.email)
      expect(response.body).toHaveProperty('isAdmin', user.isAdmin)
    
    })
  })

})