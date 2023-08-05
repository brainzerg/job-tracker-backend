const { db } = require('../../services/database')
const mysql = require('mysql')
const { emptyPromise } = require('../../utils/constants')

/**
 * GET companies list
 */
const getCompanies = async () => {
  const result = await db.query(
    //const result = await db.query('SELECT name, headqtrs FROM Companies')
    `SELECT * FROM Companies`)

  return result
}


 //GET company by id
 //@param id - companyId

const getCompanyById = async ({ id }) => {
  const result = await db.query(
    `SELECT * FROM Companies WHERE id = ?`, [+id])

  if (result.length === 0) {
    throw Error(`No company by id: ${id}`)
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
  const updateCompanyQuery = db.query(
    `UPDATE Companies
     SET name    = ?,
         products = ?,
         headqtrs     = ?
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
  //getJobs, getJobById, createJob, updateJob, deleteJob,
  getCompanies, getCompanyById, deleteCompany, createCompany, updateCompany,
}