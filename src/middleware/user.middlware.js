const axios = require('axios')
const jwtDecode = require('jwt-decode')
const { db } = require('../services/database')
const { validateAccessToken } = require('./auth0.middleware')
const { idTokenHeader } = require('../utils/constants')

const lookUpUser = async (req, res, next) => {

  const bearerToken = req.header('authorization')
  const token = bearerToken.split(' ')[1]
  const { sub: auth0Id } = jwtDecode(token)

  // extract name and email from id token (provided by Auth0 in the frontend)
  const idToken = req.header(idTokenHeader)
  const { name, email } = jwtDecode(idToken)

  let requestUser = { name, email, auth0Id }

  // Get user info from database
  const usersFromDb = await db.query(
    'SELECT * FROM User where auth0_id = ?',
    [auth0Id])


  if (usersFromDb.length === 0) {
    const result = await db.query(
      'INSERT INTO `User` (name, email, auth0_id) VALUES (?, ?, ?)',
      [name, email, auth0Id])
    requestUser.id = result.insertId
  } else {
    const userFromDb = usersFromDb[0]
    requestUser.id = userFromDb.id

    if (name !== userFromDb.name || email !== userFromDb.email) {
      await db.query(
        'UPDATE User SET name = ?, email = ? WHERE id = ?',
        [name, email, userFromDb.id])
    }
  }

  req.user = requestUser

  next()
}

const validateAndGetUser = [validateAccessToken, lookUpUser]

module.exports = { lookUpUser, validateAndGetUser }
