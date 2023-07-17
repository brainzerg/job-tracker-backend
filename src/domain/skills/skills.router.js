const express = require('express')
const { getSkillsFromDatabase } = require('./skills.service')
const { validateAccessToken } = require('src/middleware/auth0.middleware')

const skillsRouter = express.Router()

skillsRouter.get('/', validateAccessToken, (req, res) => {
  const message = getSkillsFromDatabase()

  res.status(200).json(message)
})

module.exports = { skillsRouter }