const { db } = require('./database')

// WIP.

const getOrCreateUserById = async (id) => {
  const result = await db.query(`SELECT *
                                 FROM users
                                 WHERE id = '${id}'`)

  if (result.length === 0) {
    // insert user into table
    // return returned user
  }

  return result[0]
}

module.exports = { getOrCreateUserById }