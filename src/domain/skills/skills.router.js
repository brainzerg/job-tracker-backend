const express = require('express')
const { getSkillsFromDatabase } = require('./skills.service')
const { validateAccessToken } = require('../../middleware/auth0.middleware')

const skillsRouter = express.Router()

skillsRouter.get('/', validateAccessToken, async (req, res) => {
  const message = await getSkillsFromDatabase()

  res.status(200).json(message)
})

module.exports = { skillsRouter }
