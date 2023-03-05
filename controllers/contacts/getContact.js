const Contact = require('../../models/contact');
const { HttpError } = require('../../utils');

const getContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner });
    if (!result) {
        throw HttpError(404, 'Not Found');
    }
    res.json(result);
};

module.exports = getContact;
