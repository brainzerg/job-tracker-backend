const { db } = require('../../services/database')
const mysql = require('mysql')
const { emptyPromise } = require('../../utils/constants')

/**
 * GET jobs list
 */
const getJobs = async () => {
  const result = await db.query(
    `SELECT j.id,
            j.startdate,
            c.id                 as companyId,
            c.name               as companyName,
            j.position,
            j.salary,
            j.location,
            group_concat(s.type) as skills
     FROM Jobs j
              JOIN Companies c ON j.Companies_id = c.id
              LEFT JOIN Jobs_has_Skills jhs ON jhs.Jobs_id = j.id
              LEFT JOIN Skills s ON jhs.Skills_id = s.id
     GROUP BY j.id
    `,
  )

  return result
}

/**
 * GET job by id
 * @param id - jobId
 */
const getJobById = async ({ id }) => {
  const result = await db.query(
    `SELECT j.id,
            j.startdate,
            c.id                 as companyId,
            c.name               as companyName,
            j.position,
            j.salary,
            j.location,
            group_concat(s.type) as skills
     FROM Jobs j
              JOIN Companies c ON j.Companies_id = c.id
              LEFT JOIN Jobs_has_Skills jhs ON jhs.Jobs_id = j.id
              LEFT JOIN Skills s ON jhs.Skills_id = s.id
     WHERE j.id = ?
     GROUP BY j.id
    `, [+id])

  if (result.length === 0) {
    throw Error(`No job by id: ${id}`)
  }

  return result[0]
}

/**
 * Create Jobs, Skills (if needed), and Jobs_has_Skills (if needed)
 */
const createJob = async ({ startdate, companyId, location, salary, position, skills }) => {
  const jobCreateResult = await db.query(
    `INSERT INTO Jobs(startdate, Companies_id, location, salary, position)
     VALUES (?, ?, ?, ?, ?)`,
    [startdate, companyId, location, salary, position])

  const jobId = jobCreateResult.insertId

  console.log('from payload:', skills)

  // get all skills already in the Database that was in the request payload
  const skillsResult = await db.query(
    `SELECT *
     FROM Skills
     WHERE type in (?)`, [skills])

  const skillsListInDb = skillsResult.map(skillRow => skillRow.type)
  const skillsNotInDb = skills.filter(skill => !skillsListInDb.includes(skill))

  console.log('skills in db:', skillsListInDb)
  console.log('skills not in db:', skillsNotInDb)

  if (skillsNotInDb.length > 0) {
    // for all the skills that aren't in the database, insert them into the Skills table
    const valuesQueryForSkills = skillsNotInDb.map(skill => `(${mysql.escape(skill)})`)
      .join(',')

    await db.query(
      `INSERT INTO Skills(type)
       VALUES ` + valuesQueryForSkills)
  }

  // Insert all the skills in the request (which should be in the database)
  // into Jobs_has_Skills table
  const valuesQueryForJobsHasSkills = skills.map(skill =>
    `(${jobId}, (SELECT s.id FROM Skills s WHERE s.type = ${mysql.escape(skill)}))`)
    .join(',')
  await db.query(
    `INSERT INTO Jobs_has_Skills(Jobs_id, Skills_id)
     VALUES ` + valuesQueryForJobsHasSkills)

  return { id: jobId, startdate, companyId, location, salary, position, skills }
}

/**
 * Update Jobs, Skills, and Jobs_has_Skills
 */
const updateJob = async ({ id, startdate, companyId, location, salary, position, skills: skillsInRequest }) => {
  const updateJobQuery = db.query(
    `UPDATE Jobs
     SET startdate    = ?,
         Companies_id = ?,
         location     = ?,
         salary       = ?,
         position     = ?
     WHERE id = ?`,
    [startdate, companyId, location, salary, position, id])

  // Skills
  const allSkillsInDb = await db.query(
    `SELECT id, type
     FROM Skills
     WHERE type in (?)`, [skillsInRequest],
  )

  const skillsToAdd = skillsInRequest.filter(skillName => !allSkillsInDb.some(skillRow => skillRow.type === skillName))

  const valuesQueryForNewSkills = skillsToAdd.map(skill => `(${mysql.escape(skill)})`)
    .join(',')
  console.log('values query for new skills', valuesQueryForNewSkills)
  if (valuesQueryForNewSkills.length > 0) {
    await db.query(
      `INSERT INTO Skills (type)
       VALUES ` + valuesQueryForNewSkills)
  }

  // Jobs_has_Skills
  const jobSkillsInDb = await db.query(
    `SELECT s.id as id, s.type as type
     FROM Jobs j
              JOIN Jobs_has_Skills jhs ON j.id = jhs.Jobs_id
              JOIN Skills s ON s.id = jhs.Skills_id
     WHERE j.id = ?
    `, [id])

  const newSkills = skillsInRequest.filter(skill => !jobSkillsInDb.some(skillInDb =>
    skillInDb.type === skill,
  ))
  console.log('new skills to add to job_has_skills:', newSkills)

  const skillsToAddToJobHasSkills = newSkills.map(skill => `(${mysql.escape(id)}, (SELECT id FROM Skills where type = ${mysql.escape(skill)}))`)
  const valuesQueryForNewJobsHasSkills = skillsToAddToJobHasSkills.join(',')
  console.log('query for jobs has skills:', valuesQueryForNewJobsHasSkills)
  const insertJobHasSkillsQuery = skillsToAddToJobHasSkills.length > 0 ? db.query(
    `INSERT INTO Jobs_has_Skills (Jobs_id, Skills_id)
     VALUES ` + valuesQueryForNewJobsHasSkills) : emptyPromise


  const skillIdsToDelete = jobSkillsInDb.filter(skillInDb => !skillsInRequest.includes(skillInDb.type))
    .map(skillRow => skillRow.id)
  console.log('skill ids to delete:', skillIdsToDelete)
  const deleteSkillsQuery = skillIdsToDelete.length > 0 ? db.query(
    `DELETE
     FROM Jobs_has_Skills
     WHERE Skills_id in (?)
       AND Jobs_id = ?`, [skillIdsToDelete, id]) : emptyPromise

  await Promise.all([updateJobQuery, deleteSkillsQuery, insertJobHasSkillsQuery])


  return getJobById({ id })
}

/**
 * Delete a job given jobId
 * @param id
 */
const deleteJob = async ({ id }) => {
  return db.query(
    `DELETE
     FROM Jobs
     WHERE id = ?`, [id])
}

const getJobFromCompanyId = async ({ companyId }) => {
  console.log(`company id: ${companyId}`)
  return db.query(
    `SELECT j.id,
            j.startdate,
            c.id                 as companyId,
            c.name               as companyName,
            j.position,
            j.salary,
            j.location,
            group_concat(s.type) as skills
     FROM Jobs j
              JOIN Companies c ON j.Companies_id = c.id
              LEFT JOIN Jobs_has_Skills jhs ON jhs.Jobs_id = j.id
              LEFT JOIN Skills s ON jhs.Skills_id = s.id
     WHERE j.Companies_id = ?
     GROUP BY j.id`,
    [companyId],
  )
}

module.exports = {
  getJobs, getJobById, createJob, updateJob, deleteJob, getJobFromCompanyId,
}