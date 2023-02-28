const express = require('express');
const {
    getContact,
    postContact,
    updateStatusContact,
    getById,
    deleteContactById,
    changeContactById,
} = require('../../controllers/contacts');

const router = express.Router();

router.get('/', getContact);

router.get('/:contactId', getById);

router.post('/', postContact);

router.patch('/:contactId/favorite', updateStatusContact);

router.delete('/:contactId', deleteContactById);

router.put('/:contactId', changeContactById);

module.exports = router;
