const { db } = require('../../services/database')

const getSkillsFromDatabase = async () => {
  // Here is how you would fetch from the database
  // Replace below with a proper SQL statement
  // TODO: Work in progress
  console.log(await db.query('select * from Skills s join User_has_Skills uhs on s.id = uhs.user_id'))
  const result = await db.query('select s.id as skill_id, s.type as name, uhs.proficiency as proficiency from Skills s join User_has_Skills uhs on s.id = uhs.user_id ' +
    'where s.id = ?', [1])
  console.log(result)

  return {
    skills: result
  }
}

module.exports = {
  getSkillsFromDatabase,
}
