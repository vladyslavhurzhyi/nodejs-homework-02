const { Schema, model } = require('mongoose');
const Joi = require('joi');
const handleMongooseError = require('../utils/handleMongooseError');

const userSchema = Schema(
    {
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ['starter', 'pro', 'business'],
            default: 'starter',
        },
        token: {
            type: String,
            default: null,
        },

        avatarURL: {
            type: String,
            required: true,
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    },

    { versionKey: false, timestapms: true }
);

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const schemas = {
    registerSchema,
    loginSchema,
};

module.exports = { schemas, User };
