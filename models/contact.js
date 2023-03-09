const { Schema, model } = require('mongoose');

const contactSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { versionKey: false, timestamp: true }
);

contactSchema.post('save', (error, data, next) => {
    error.status = 400;
    next();
});

const Contact = model('contact', contactSchema);

module.exports = Contact;
