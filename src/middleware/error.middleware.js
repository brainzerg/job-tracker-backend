const {
  InvalidTokenError,
  UnauthorizedError,
  InsufficientScopeError,
} = require('express-oauth2-jwt-bearer')
const { BadRequestError } = require('../errors/BadRequestError')

const errorHandler = (error, request, response, next) => {
  if (error instanceof InsufficientScopeError) {
    const message = 'Permission denied'

    response.status(error.status).json({ message })

    return
  }

  if (error instanceof InvalidTokenError) {
    const message = 'Bad credentials'

    response.status(error.status).json({ message })

    return
  }

  if (error instanceof UnauthorizedError) {
    const message = 'Requires authentication'

    response.status(error.status).json({ message })

    return
  }

  if (error instanceof BadRequestError) {
    const status = 400
    response.status(status).json({ message: error.message })
    return
  }

  const status = 500
  const message = error.message

  response.status(status).json({ message })
}

module.exports = {
  errorHandler,
}
