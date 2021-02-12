const request = require('supertest')
const bcrypt = require('bcrypt')

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

    const getUserProfile = () =>{
      return request(server)
        .get('/api/profile')
        .set('x-auth-token', token)
        .send()
    }

    it('should return 401 client is not logged in', async () => {
      token = ''
      
      const response = await getUserProfile()

      expect(response.status).toBe(401)
    })

    it('should return the user', async () => {
      const response = await getUserProfile()

      expect(response.body).toHaveProperty('name', user.name)
      expect(response.body).toHaveProperty('email', user.email)
      expect(response.body).toHaveProperty('isAdmin', user.isAdmin)
    })
  })

  describe('PUT /', () => {
    let newName
    let newEmail
  
    const updateUser = () => {
      return request(server)
        .put('/api/profile')
        .set('x-auth-token', token)
        .send({name: newName, email: newEmail})
    }
    
    beforeEach(() => {
      newName = 'newName'
      newEmail = 'newEmail@gmail.com'
      token = user.generateAuthToken()
    })

    it('should return 401 if the client is not logged in', async () => {
      token = ''

      const response = await updateUser()

      expect(response.status).toBe(401)
    })

    it('should return 400 if newName is invalid', async () => {
      newName = 1

      const response = await updateUser()

      expect(response.status).toBe(400)
    })

    it('should return 400 if newEmail is invalid', async () => {
      newEmail = 'email'

      const response = await updateUser()

      expect(response.status).toBe(400)
    })

    it('should return 400 if newEmail is already registered', async () => {
      newEmail = 'user@gmail.com'

      const response = await updateUser()

      expect(response.status).toBe(400)
    })

    it('should updated and return the user', async () => {
      const response = await updateUser()

      expect(response.body).toHaveProperty('name', newName)
      expect(response.body).toHaveProperty('email', newEmail)
    })
  })

  describe('PUT /password', () => {
    let newPassword
    
    beforeEach(() => {
      newPassword = '0000'
      user.generateAuthToken()
    })

    const updatePassword = () => {
      return request(server)
        .put('/api/profile/password')
        .set('x-auth-token', token)
        .send({password: newPassword})
    }


    it('should return 401 if client is not logged in', async () => {
      token = ''

      const response = await updatePassword()

      expect(response.status).toBe(401)
    })

    it('should return 400 if password is invalid', async () => {
      newPassword = 1

      const response = await updatePassword()

      expect(response.status).toBe(400)
    })

    it('should update the encrypted user password', async () => {
      await updatePassword()
    
      const findUser = await User.findOne({ email: 'user@gmail.com'})

      const passwordCompare = await bcrypt.compare(newPassword, findUser.password)

      expect(passwordCompare).toBe(true)
    })
  })

  describe('DELETE /', () => {
    const deleteProfile = () => {
      return request(server)
        .delete('/api/profile')
        .set('x-auth-token', token)
        .send()
    }

    it('should return 401 if client is not logged in', async () => {
      token = ''
      
      const response = await deleteProfile()

      expect(response.status).toBe(401)
    })

    it('should delete the user profile', async () => {
      await deleteProfile()

      const user = await User.findOne({ email: 'user@gmail.com'})

      expect(user).toBeNull()
    })
  })
})