const express = require('express');
const {
    createReview,
    getAllReview,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const router = express.Router();

router
    .route('/')
    .get(getAllReview)
    .post(authenticateUser, createReview);
router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;