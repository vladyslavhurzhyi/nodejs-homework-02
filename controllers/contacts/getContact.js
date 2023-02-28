const Contact = require('../../models/contact');
const { HttpError } = require('../../utils');

const getContact = async (req, res) => {
    const result = await Contact.find();
    if (!result) {
        throw HttpError(404, 'Not Found');
    }
    res.json(result);
};

module.exports = getContact;
