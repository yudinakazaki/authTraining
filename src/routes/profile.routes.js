const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const { User, validateUser } = require('../models/users')
const { validatePassword, validateUpdateUser } = require('../models/profile')

const ensureAuthentication = require('../middlewares/ensureAuthentication')

const router = express.Router()

router.get('/', ensureAuthentication, async (request, response) => {
  const user = await User.findById(request.user._id)

  return response.send(user)
})

router.put('/', ensureAuthentication, async (request, response) => {
  const { error } = validateUpdateUser(request.body)
  if(error) return response.status(404).send(error.details[0].message)

  if(request.body.email){
    const isAlreadyRegisterd = await User.findOne({ email: request.body.email })
    if(isAlreadyRegisterd) return response.status(400).send('E-mail already in use')
  }

  const updatedUser = await User.findByIdAndUpdate(request.user._id, {
    name: request.body.name,
    email: request.body.email
  }, {new: true})


  return response.send(_.pick(updatedUser, ['_id', 'name', 'email']))
})

router.put('/password', ensureAuthentication, async (request, response) => {
  const { error } = validatePassword(request.body)
  if(error) return response.status(400).send(error.details[0].message)
  
  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(request.body.password, salt)

  await User.findByIdAndUpdate(request.user._id, {
    password: newPassword
  })

  return response.send('Password updated successfully')
})

router.delete('/', ensureAuthentication, async (request, response) => {
  await User.findByIdAndRemove(request.user._id)

  return response.send('Account deleted successfully!')
})

module.exports = router