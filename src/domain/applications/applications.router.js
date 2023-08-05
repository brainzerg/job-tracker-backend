const express = require('express')
const { validateAndGetUser } = require('../../middleware/user.middlware')
const { getApplications, getApplicationById, createApplication, updateApplication, deleteApplicationById } = require('./applications.service')
const { BadRequestError } = require('../../errors/BadRequestError')

const applicationsRouter = express.Router()

applicationsRouter.get('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id

  const applications = await getApplications({ userId })

  res.json(applications)
})

applicationsRouter.get('/:applicationId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { applicationId } = req.params

  if (!applicationId) {
    throw new BadRequestError("Need a proper application id")
    return
  }

  const application = await getApplicationById({ userId, applicationId })

  res.json(application)
})

applicationsRouter.post('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { jobId, applydate, status } = req.body

  if (!jobId) {
    throw new BadRequestError("Need a proper job id")
    return
  }

  const newApplication = await createApplication({ userId, jobId, applydate, status })

  res.json(newApplication)
})

applicationsRouter.put('/:applicationId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { applicationId } = req.params
  const { jobId, applydate, status } = req.body

  if (!applicationId || !jobId) {
    throw new BadRequestError("Need proper application and job ids")
    return
  }

  const updatedApplication = await updateApplication({ userId, applicationId, status, applydate, jobId })

  res.json(updatedApplication)
})

applicationsRouter.delete('/:applicationId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { applicationId } = req.params

  if (!applicationId) {
    throw new BadRequestError("Need a proper application id")
    return
  }

  await deleteApplicationById({ userId, applicationId })

  res.status(200).json({ message: 'Successful' })
})

module.exports = { applicationsRouter }