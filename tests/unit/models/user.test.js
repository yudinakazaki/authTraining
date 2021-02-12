require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const { User } = require('../../../src/models/users')

describe('generateAuthToken method', () => {
  it('should generate a jwt token with the given properties', () => {
    const payload = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: false
    }

    const user = new User(payload)
    const token = user.generateAuthToken()

    const decoded = jwt.verify(token, process.env.JWTSIGNKEY)
    expect(decoded).toMatchObject(payload)
  })
})