const { v4 } = require('uuid');

function addId(contact) {
    const newContact = {
        id: v4(),
        ...contact,
    };
    return newContact;
}

module.exports = { addId };
