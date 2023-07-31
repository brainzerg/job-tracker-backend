const axios = require('axios')
const jwtDecode = require('jwt-decode')
const { db } = require('../services/database')
const { validateAccessToken } = require('./auth0.middleware')

const auth0Domain = process.env.AUTH0_DOMAIN

const lookUpUser = async (req, res, next) => {

  const bearerToken = req.header('authorization')
  const token = bearerToken.split(' ')[1]
  const { sub: auth0Id } = jwtDecode(token)

  /**
   * Flow:
   * 1. Get user information from /userinfo endpoint
   * 2. Get user from the database
   * 3. If there is no entry in the DB, add a row in the database with information from /userinfo endpoint
   * 4. If "name" or "email" field is different, update user info in the database
   * 5. Attach "user" object to the request object
   */

    // Get user info from Auth0 and database
  const getUserFromAuth0 = axios.get(`https://${auth0Domain}/userinfo`, { headers: { Authorization: bearerToken } })
  const getUserFromDb = db.query('SELECT * FROM User where auth0_id = ?', [auth0Id])

  const [responseFromAuth0, usersFromDb] = await Promise.all([getUserFromAuth0, getUserFromDb])

  const { name, email } = responseFromAuth0.data

  let user = { name, email, auth0Id }

  console.log('User Info:', responseFromAuth0.data)

  if (usersFromDb.length === 0) {
    const result = await db.query('INSERT INTO `User` (name, email, auth0_id) VALUES (?, ?, ?)', [name, email, auth0Id])
    user.id = result.insertId
  } else {
    const userFromDb = usersFromDb[0]
    user.id = userFromDb.id

    if (name !== userFromDb.name || email !== userFromDb.email) {
      await db.query('UPDATE User SET name = ?, email = ? WHERE id = ?',
        [name, email, userFromDb.id])
    }
  }

  req.user = user

  next()
}

const validateAndGetUser = [validateAccessToken, lookUpUser]

module.exports = { lookUpUser, validateAndGetUser }
