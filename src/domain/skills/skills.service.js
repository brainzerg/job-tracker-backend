const { db } = require('../../services/database')
const { BadRequestError } = require('../../errors/BadRequestError')

const getUserSkills = async ({ userId }) => {
  const userSkills = await db.query(
    `SELECT s.id as id, s.type as name, uhs.proficiency
     FROM Skills s
              JOIN User_has_Skills uhs ON uhs.Skills_id = s.id
     WHERE uhs.User_id = ?`,
    [userId],
  )

  return userSkills
}

const getUserSkillById = async ({ userId, skillId }) => {
  const result = await db.query(
    `SELECT s.id as id, s.type as name, uhs.proficiency
     FROM Skills s
              JOIN User_has_Skills uhs ON uhs.Skills_id = s.id
     WHERE uhs.User_id = ?
       AND uhs.Skills_id = ?`,
    [userId, skillId],
  )

  if (result.length === 0) {
    throw new BadRequestError(`No skill by user id and skill id: ${userId}, ${skillId}`)
  }

  return result[0]
}

const createUserSkill = async ({ userId, name, proficiency }) => {
  const skillByName = await db.query(
    `SELECT id, type as name
     FROM Skills
     WHERE type = ?`,
    [name],
  )

  let skillId

  if (skillByName.length === 0) {
    const insertResult = await db.query(
      `INSERT INTO Skills(type)
       VALUES (?)`,
      [name],
    )
    skillId = insertResult.insertId
  } else {
    skillId = skillByName[0].id
  }


  await db.query(
    `INSERT INTO User_has_Skills (User_id, Skills_id, proficiency)
     VALUES (?, ?, ?)`,
    [userId, skillId, proficiency],
  )

  return getUserSkillById({ userId, skillId })
}

const updateUserSkill = async ({ userId, skillId, proficiency }) => {
  const skillResult = await db.query(
    `SELECT *
     FROM Skills
     WHERE id = ?`,
    [skillId],
  )

  if (skillResult.length === 0) {
    throw new BadRequestError(`No skill with id ${skillId}`)
  }

  await db.query(
    `UPDATE User_has_Skills
     SET proficiency = ?
     WHERE User_id = ?
       AND Skills_id = ?`,
    [proficiency, userId, skillId],
  )

  return getUserSkillById({ userId, skillId })
}

const deleteUserSkill = async ({ userId, skillId }) => {
  await getUserSkillById({ userId, skillId })

  await db.query(
    `DELETE
     FROM User_has_Skills
     WHERE User_id = ?
       AND Skills_id = ?`,
    [userId, skillId],
  )
}

module.exports = {
  getUserSkills, getUserSkillById, createUserSkill, deleteUserSkill, updateUserSkill,
}
