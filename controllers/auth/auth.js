const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const nanoid = require('nanoid');

require('dotenv').config();

const { SECRET_KEY, BASE_URL } = process.env;

const { User } = require('../../models/user');

const { ctrlWrapper, HttpError } = require('../../utils');
const { resizeImage } = require('../../utils/resizeImage');
const { sendEmail } = require('../../utils/sendEmail');

const register = async (req, res) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email);

    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const newUser = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL: avatarURL,
        verificationToken,
    });

    const verifyEmail = {
        to: email,
        subject: 'Verify Email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${verificationToken}"> Click to verify email `,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token: token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const current = (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.json({
        message: 'logout sucsses',
    });
};

const avatarsDir = path.resolve('public', 'avatars');

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    await fs.rename(tempUpload, resultUpload);

    await resizeImage(resultUpload, 250, 250);

    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    current: ctrlWrapper(current),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
