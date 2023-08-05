const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const _ = require('express-async-errors')
const helmet = require('helmet')
const nocache = require('nocache')
const morgan = require('morgan')

dotenv.config()

const { errorHandler } = require('./middleware/error.middleware')
const { notFoundHandler } = require('./middleware/not-found.middleware')

const { skillsRouter } = require('./domain/skills/skills.router')
const { companiesRouter } = require('./domain/companies/companies.router')
const { jobsRouter } = require('./domain/jobs/jobs.router')
const { contactsRouter } = require('./domain/contacts/contacts.router')
const { applicationsRouter } = require('./domain/applications/applications.router')
const { companiesRouter } = require('./domain/companies/companies.router')

const { idTokenHeader } = require('./utils/constants')
const { db } = require('./services/database')
db.init()

if (!(process.env.PORT && process.env.CLIENT_ORIGIN_URL)) {
  throw new Error(
    'Missing required environment variables. Check docs for more info.',
  )
}


const PORT = parseInt(process.env.PORT, 10)
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL

const app = express()
const apiRouter = express.Router()

app.use(morgan('dev'))
app.use(express.json())
app.set('json spaces', 2)

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        'default-src': ['\'none\''],
        'frame-ancestors': ['\'none\''],
      },
    },
    frameguard: {
      action: 'deny',
    },
  }),
)

app.use((req, res, next) => {
  res.contentType('application/json; charset=utf-8')
  next()
})
app.use(nocache())

app.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Authorization', 'Content-Type', idTokenHeader],
    maxAge: 86400,
  }),
)

app.use('/api', apiRouter)
apiRouter.use('/skills', skillsRouter)
apiRouter.use('/jobs', jobsRouter)
apiRouter.use('/companies', companiesRouter)
apiRouter.use('/contacts', contactsRouter)
apiRouter.use('/applications', applicationsRouter)
apiRouter.use('/companies', companiesRouter)

app.use(errorHandler)
app.use(notFoundHandler)

app.listen(PORT, () => {
  console.log(`app started on port ${PORT}. Press Ctrl+c to shut down`)
})
