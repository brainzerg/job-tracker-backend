const { db } = require('../../services/database')
const { BadRequestError } = require('../../errors/BadRequestError')

const getContacts = async ({ userId }) => {
  return await db.query(
    `SELECT c.id, c.name, c.email, c.phone, co.name as companyName, co.id as companyId
     FROM Contacts c
              JOIN User u on c.User_id = u.id
              JOIN Companies co on c.Companies_id = co.id
     WHERE u.id = ?`, [userId],
  )
}

const getContactById = async ({ userId, contactId }) => {
  const result = await db.query(
    `SELECT c.id, c.name, c.email, c.phone, co.name as companyName, co.id as companyId
     FROM Contacts c
              JOIN User u on c.User_id = u.id
              JOIN Companies co on c.Companies_id = co.id
     WHERE u.id = ?
       AND c.id = ?`, [userId, contactId],
  )

  if (result.length === 0) {
    throw new BadRequestError(`No contact by (userId, contactId) ${userId}, ${contactId}`)
  }

  return result[0]
}

const createContact = async ({ userId, name, email, phone, companyId }) => {
  const result = await db.query(
    `INSERT INTO Contacts (name, email, phone, User_id, Companies_id)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, userId, companyId],
  )

  return { id: result.insertId, name, email, phone, userId, companyId }
}

const updateContact = async ({ userId, name, email, phone, companyId, contactId }) => {
  await getContactById({ userId, contactId })

  await db.query(
    `UPDATE Contacts
     SET name = ?,
         email = ?,
         phone = ?,
         Companies_id = ?
     WHERE id = ?`,
    [name, email, phone, companyId, contactId],
  )

  return { name, email, phone, companyId, contactId }
}

const deleteContactById = async ({ userId, contactId }) => {
  const _contact = getContactById({ userId, contactId })

  await db.query(
    `DELETE
     FROM Contacts
     WHERE User_id = ?
       AND id = ?`,
    [userId, contactId],
  )
}

module.exports = { getContacts, getContactById, createContact, updateContact, deleteContactById }