const express = require('express')
const { validateAndGetUser } = require('../../middleware/user.middlware')
const { db } = require('../../services/database')
const { updateJob, getJobById, getJobs, deleteJob, createJob, getJobFromCompanyId } = require('./jobs.service')
const { BadRequestError } = require('../../errors/BadRequestError')

const jobsRouter = express.Router()

jobsRouter.get('/jobs-from-company', validateAndGetUser, async (req, res) => {
  const { companyId } = req.query
  if (isNaN(Number(companyId))) {
    throw new BadRequestError(`Invalid company id: ${companyId}`)
  }

  const result = await getJobFromCompanyId({ companyId })

  res.json(result)
})

jobsRouter.get('/:jobId', validateAndGetUser, async (req, res, next) => {
  const { jobId } = req.params

  const job = await getJobById({ id: jobId })

  res.json(job)
})

jobsRouter.get('/', validateAndGetUser, async (req, res) => {
  const jobs = await getJobs()

  res.json(jobs)
})

jobsRouter.post('/', validateAndGetUser, async (req, res) => {

  const { location, companyId, startdate, salary, position, skills: commaSeparatedSkills } = req.body
  const skills = commaSeparatedSkills.split(',')
    .map(skill => skill.trim().toLowerCase())
    .filter(skill => skill.length > 0)

  const result = await createJob({ location, companyId, startdate, salary, position, skills })

  res.json(result)
})

jobsRouter.put('/:jobId', validateAndGetUser, async (req, res) => {
  const { jobId } = req.params
  const { location, companyId, startdate, salary, position, skills: commaSeparatedSkills } = req.body
  const skills = commaSeparatedSkills.split(',')
    .map(skill => skill.trim().toLowerCase())
    .filter(skill => skill.length > 0)

  const updatedJob = await updateJob({ id: jobId, location, companyId, startdate, salary, position, skills })

  res.json(updatedJob)
})

jobsRouter.delete('/:jobId', validateAndGetUser, async (req, res) => {
  const { jobId } = req.params
  const result = await deleteJob({ id: jobId })

  res.json(result)
})


module.exports = { jobsRouter }
