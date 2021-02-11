const express = require('express')

const home = require('../routes/home.routes')
const users = require('../routes/users.routes')
const login = require('../routes/login.routes')
const profile = require('../routes/profile.routes')

module.exports = (app) => {
  app.use(express.json())
  
  app.use('/', home)
  app.use('/api/users', users)
  app.use('/api/login', login)
  app.use('/api/profile', profile)
}