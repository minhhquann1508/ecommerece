const express = require('express');
const { getAllUser, getSingleUser, showCurrentUser, updateUser, updateUserPassword, deleteUser } = require('../controllers/userController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const router = express.Router();

router.route('/').get(authenticateUser, authorizePermissions('admin'), getAllUser);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;