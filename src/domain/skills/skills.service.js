const { db } = require('../../services/database')

const getSkillsFromDatabase = async () => {
  // Here is how you would fetch from the database
  // Replace below with a proper SQL statement
  const result = await db.query('select 0')

  return {
    favoriteNumber: result['0'],
    skill: 'My main programming language is C and JavaScript.',
  }
}

module.exports = {
  getSkillsFromDatabase,
}
