const express = require('express')
const { validateAndGetUser } = require('../../middleware/user.middlware')
const { getContacts, getContactById, createContact, updateContact, deleteContactById } = require('./contacts.service')
const contactsRouter = express.Router()

contactsRouter.get('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id

  const contacts = await getContacts({ userId })

  res.json(contacts)
})

contactsRouter.get('/:contactId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { contactId } = req.params

  const contact = await getContactById({ userId, contactId })

  res.json(contact)
})

contactsRouter.post('/', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { name, email, phone, companyId } = req.body

  const newContact = await createContact({ userId, name, companyId, email, phone })

  res.json(newContact)
})

contactsRouter.put('/:contactId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { contactId } = req.params
  const { name, email, phone, companyId } = req.body

  const updatedContact = await updateContact({ userId, contactId, companyId, email, phone, name })

  res.json(updatedContact)
})

contactsRouter.delete('/:contactId', validateAndGetUser, async (req, res) => {
  const userId = req.user.id
  const { contactId } = req.params

  await deleteContactById({ userId, contactId })

  res.status(200).json({ message: 'Successful' })
})


module.exports = { contactsRouter }