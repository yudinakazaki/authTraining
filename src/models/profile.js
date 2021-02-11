const Joi = require('joi')

const validateUpdateUser = (params) => {
  const updateUserJoiSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email()
  })

  return updateUserJoiSchema.validate(params)
}

const validatePassword = (password) => {
  const passwordJoiSchema = Joi.object({
    password: Joi.string().required()
  })

  return passwordJoiSchema.validate(password)
}

module.exports.validateUpdateUser = validateUpdateUser
module.exports.validatePassword = validatePassword