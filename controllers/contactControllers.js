const Contact = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../utils/');
const { addScema, updateScema } = require('../utils/contactAddScema');

const getContact = async (req, res) => {
    const result = await Contact.find();
    if (!result) {
        throw HttpError(404, 'Not Found');
    }
    res.json(result);
};

const postContact = async (req, res) => {
    const body = req.body;
    const { error } = addScema.validate(body);
    if (error) {
        throw HttpError(400, 'error in the fields');
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateStatusContact = async (req, res) => {
    const id = req.params.contactId;
    const body = req.body;
    if (!body) {
        throw HttpError(400, 'missing field favorite');
    }
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
};

const getById = async (req, res) => {
    const id = req.params.contactId;
    console.log('req.params.contactId', req.params.contactId);
    const result = await Contact.findOne({ _id: id });
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.json(result);
};

const deleteContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json({ message: 'contact deleted' });
};

const changeContactById = async (req, res) => {
    const { contactId } = req.params;
    const body = req.body;
    if (!body) {
        throw HttpError(400, 'missing fields');
    }

    const { error } = updateScema.validate(body);
    if (error) {
        throw HttpError(400, 'error in the fields');
    }
    const result = await Contact.findOneAndUpdate(contactId, body, {
        new: true,
    });
    if (!result) {
        throw HttpError(404, 'Not found');
    }
    res.status(200).json({ result });
};

module.exports = {
    getContact: ctrlWrapper(getContact),
    postContact: ctrlWrapper(postContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    getById: ctrlWrapper(getById),
    deleteContactById: ctrlWrapper(deleteContactById),
    changeContactById: ctrlWrapper(changeContactById),
};
