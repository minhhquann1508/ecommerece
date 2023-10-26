const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/index');
const { createToken, attachCookiesToResponse, checkPermission } = require('../utils');

exports.getAllUser = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    if (!users) {
        throw new CustomAPIError.NotFoundError('Cannot find any user');
    }
    res.status(StatusCodes.OK).json({ users });
};

exports.getSingleUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new CustomAPIError.NotFoundError('Cannot find this user');
    }
    checkPermission(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
};

exports.showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user });
};

//update user.save()
exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new CustomAPIError.BadRequestError('Please provide name and password');
    }
    const user = await User.findOne({ _id: req.user.userId });
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = createToken(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

exports.updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomAPIError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomAPIError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Password updated !' });
};


exports.deleteUser = async (req, res) => {
    res.send('deleteUser');
};

// exports.updateUser = async (req, res) => {
//     const { name, email } = req.body;
//     if (!name || !email) {
//         throw new CustomAPIError.BadRequestError('Please provide name and password');
//     }
//     const user = await User.findOneAndUpdate(
//         { _id: req.user.userId },
//         { name, email },
//         { new: true, runValidators: true }
//     );
//     const tokenUser = createToken(user);
//     attachCookiesToResponse({ res, user: tokenUser });
//     res.status(StatusCodes.OK).json({ user: tokenUser });
// };