const express = require('express')
const {
  getUserSkills,
  getUserSkillById,
  createUserSkill,
  updateUserSkill,
  deleteUserSkill,
} = require('./skills.service')
const { validateAndGetUser } = require('../../middleware/user.middlware')

const skillsRouter = express.Router()

skillsRouter.get('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id

  const userSkills = await getUserSkills({ userId })

  res.json(userSkills)
})

skillsRouter.get('/:skillId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { skillId } = req.params

  const userSkillById = await getUserSkillById({ userId, skillId })

  res.json(userSkillById)
})

skillsRouter.post('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { name, proficiency } = req.body

  const createdUserSkill = await createUserSkill({ userId, proficiency, name })

  res.json(createdUserSkill)
})

skillsRouter.put('/:skillId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { skillId, proficiency } = req.body

  const updatedUserSkill = await updateUserSkill({ userId, proficiency, skillId })

  res.json(updatedUserSkill)
})

skillsRouter.delete('/:skillId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { skillId } = req.params

  await deleteUserSkill({ userId, skillId })

  res.status(200).json({ message: 'Successful' })
})

module.exports = { skillsRouter }
