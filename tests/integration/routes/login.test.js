require('dotenv').config()
const request = require('supertest')
const bcrypt = require('bcrypt')

const { User } = require('../../../src/models/users')

describe('/api/login', () => {
  let server
  let user
  let email
  let password


  beforeEach(async () => {
    server = require('../../../src/server')
    email = 'email@gmail.com'
    password = '1234'

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    user = new User({
      email,
      password: hashedPassword,
      name: 'userName',
      isAdmin: false  
    })

    await user.save()  
  })

  afterEach(async () => User.remove({}))

  const login = () => {
    return request(server)
      .post('/api/login')
      .send({email, password})
  }
  
  it('should return 400 if email is invalid', async () => {
    email = 1

    const response = await login()

    expect(response.status).toBe(400)
  })

  it('should return 400 if password is invalid', async () => {
    password = 1

    const response = await login()

    expect(response.status).toBe(400)
  })

  it('should return 400 if the email is valid but not found', async () => {
    email = 'changed@gmail.com'
    
    const response = await login()

    expect(response.status).toBe(400)

  })

  it('should return 400 if the password is valid but does not match', async () => {
    password = '1'

    const response = await login()

    expect(response.status).toBe(400)
  })

  it('should return 200 it the login is valid', async () => {
    const response = await login()

    expect(response.status).toBe(200)
  })
})