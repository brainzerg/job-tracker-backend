const express = require('express')
const { getSkillsFromDatabase } = require('./skills.service')
const { validateAndGetUser } = require('../../middleware/user.middlware')

const skillsRouter = express.Router()

skillsRouter.get('/', validateAndGetUser, async (req, res) => {
  // req.user has { name, email, auth0Id, id } fields
  const message = await getSkillsFromDatabase()

  res.status(200).json(message)
})

module.exports = { skillsRouter }
