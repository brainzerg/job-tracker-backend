const { db } = require('../../services/database')
const { BadRequestError } = require('../../errors/BadRequestError')

/**
 * GET companies list
 */
const getCompanies = async () => {
  const result = await db.query(
    `SELECT *
     FROM Companies`)

  return result
}


//GET company by id
//@param id - companyId

const getCompanyById = async ({ id }) => {
  const result = await db.query(
    `SELECT *
     FROM Companies
     WHERE id = ?`, [+id])

  if (result.length === 0) {
    throw new BadRequestError(`No company with id: ${companyId}`)
  }

  return result[0]
}


//Create Company

const createCompany = async ({ name, products, headqtrs }) => {
  const companyCreateResult = await db.query(
    `INSERT INTO Companies(name, products, headqtrs)
     VALUES (?, ?, ?)`, [name, products, headqtrs])

  const companyId = companyCreateResult.insertId
  return { id: companyId, name, products, headqtrs }
}


//Update Company

const updateCompany = async ({ id, name, products, headqtrs }) => {
  const updateCompanyQuery = await db.query(
    `UPDATE Companies
     SET name     = ?,
         products = ?,
         headqtrs = ?
     WHERE id = ?`,
    [name, products, headqtrs, id])

  return getCompanyById({ id })
}


//Delete a company given companyId
//@param id

const deleteCompany = async ({ id }) => {
  return db.query(
    `DELETE
     FROM Companies
     WHERE id = ?`, [id])
}

module.exports = {
  getCompanies, getCompanyById, deleteCompany, createCompany, updateCompany,
}
