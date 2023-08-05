const { db } = require('../../services/database')
const { BadRequestError } = require('../../errors/BadRequestError')

const getApplications = async ({ userId }) => {
  const result = await db.query(
    `SELECT a.id,
            a.applydate as applydate,
            c.name as companyName,
            c.id as companyId,
            j.position,
            j.startdate,
            j.id as jobId,
            a.status
     FROM Applications a
              JOIN User u on a.User_id = u.id
              JOIN Jobs j ON a.Jobs_id = j.id
              JOIN Companies c ON j.Companies_id = c.id
     WHERE u.id = ?`, [userId],
  )

  return result
}

const getApplicationById = async ({ userId, applicationId }) => {
  const result = await db.query(
    `SELECT a.id,
            a.applydate as applydate,
            c.name      as companyName,
            c.id        as companyId,
            j.position,
            j.startdate,
            j.id        as jobId,
            a.status
     FROM Applications a
              JOIN User u on a.User_id = u.id
              JOIN Jobs j ON a.Jobs_id = j.id
              JOIN Companies c ON j.Companies_id = c.id
     WHERE u.id = ?
       AND a.id = ?`, [userId, applicationId],
  )

  if (result.length === 0) {
    throw new BadRequestError(`No application by (id, user id): ${applicationId}, ${userId}`)
  }

  return result[0]
}

const createApplication = async ({ userId, status, applydate, jobId }) => {
  console.log('arguments:', arguments)
  const result = await db.query(
    `INSERT INTO Applications (status, applydate, Jobs_id, User_id)
     VALUES (?, ?, ?, ?)`,
    [status, applydate, jobId, userId],
  )

  // return getApplicationById({ userId, applicationId: result.insertId })
  return result
}

const updateApplication = async ({ userId, applicationId, status, applydate, jobId }) => {
  await getApplicationById({ userId, applicationId })

  await db.query(
    `UPDATE Applications
     SET status       = ?,
         applydate    = ?,
         Jobs_id      = ?
     WHERE id = ?
       AND User_id = ?`,
    [status, applydate, jobId, applicationId, userId],
  )

  return getApplicationById({ userId, applicationId })
}

const deleteApplicationById = async ({ userId, applicationId }) => {
  await getApplicationById({ userId, applicationId })

  await db.query(
    `DELETE
     FROM Applications
     WHERE id = ?
       AND User_id = ?`,
    [applicationId, userId],
  )
}

module.exports = { getApplicationById, createApplication, deleteApplicationById, getApplications, updateApplication }
