const express = require('express')
const { validateAndGetUser } = require('../../middleware/user.middlware')
const { getCompanyById, getCompanies, deleteCompany, createCompany, updateCompany } = require('./companies.service')

const companiesRouter= express.Router()

companiesRouter.get('/:companyId', validateAndGetUser, async (req, res, next) => {
  const { companyId } = req.params

  const company = await getCompanyById({ id: companyId })

  res.json(company)
})

companiesRouter.get('/', validateAndGetUser, async (req, res) => {
  const companies = await getCompanies()

  res.json(companies)
})

companiesRouter.post('/', validateAndGetUser, async (req, res) => {

  const { name, products, headqtrs } = req.body

  const result = await createCompany({ name, products, headqtrs })

  res.json(result)
})

companiesRouter.put('/:companyId', validateAndGetUser, async (req, res) => {
  const { companyId } = req.params
  const { name, products, headqtrs } = req.body

  const updatedCompany = await updateCompany({ id: companyId, name, products, headqtrs })

  res.json(updatedCompany)
})

companiesRouter.delete('/:companyId', validateAndGetUser, async (req, res) => {
  const { companyId } = req.params
  const result = await deleteCompany({ id: companyId })

  res.json(result)
})

module.exports = { companiesRouter }
