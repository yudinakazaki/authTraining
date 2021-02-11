const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('lodash')

const { User, validateUser } = require('../models/users')
const validateObjectId = require('../middlewares/validateObjectId')
const ensureAuthentication = require('../middlewares/ensureAuthentication')
const ensureAdmin = require('../middlewares/ensureAdmin')

const router = express.Router()

router.get('/', [ensureAuthentication, ensureAdmin], async (request, response) => {
  const users = await User.find()

  return response.send(users)
})

router.get('/:id', [validateObjectId, ensureAuthentication, ensureAdmin], async (request, response) => {
  const findUser = await User.findById(request.params.id)
  if(!findUser) return response.status(404).send('User not found!')

  return response.send(findUser)
})

router.post('/', async (request, response) => {
  const { error } = validateUser(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const isAlreadyRegisterd = await User.findOne({ email: request.body.email })
  if(isAlreadyRegisterd) return response.status(400).send('E-mail already registered!')

  const newUser = new User({
    name: request.body.name,
    email: request.body.email,
    isAdmin: request.body.isAdmin
  })

  const salt = await bcrypt.genSalt(10)
  newUser.password = await bcrypt.hash(request.body.password, salt)

  await newUser.save()

  return response.send(_.pick(newUser, ['_id', 'name', 'email', 'isAdmin']))
})

router.put('/:id', [validateObjectId, ensureAuthentication, ensureAdmin], async (request, response) => {
  const { error } = validateUser(request.body)
  if(error) return response.status(400).send(erro.details[0].message)
  
  const isAlreadyRegisterd = User.findOne(request.body.email)
  if(isAlreadyRegisterd) return response.status(400).send('E-mail already in use')

  const updatedUser = await User.findByIdAndUpdate(request.params.id, {
    name: request.body.name,
    email: request.body.email,
    isAdmin: request.body.isAdmin
  })

  if(!updatedUser) return response.status(400).send('User not found!')

  return response.send(updatedUser)
})

router.delete('/:id', [validateObjectId, ensureAuthentication, ensureAdmin], async (request, response) => {
  const deletedUser = await User.findByIdAndRemove(request.params.id)

  if(!deletedUser) return response.status(400).send('User not found')

  return response.send('User deleted successfully!')
})

module.exports = router