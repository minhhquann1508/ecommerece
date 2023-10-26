const express = require('express');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const {
    getAllProduct,
    getSigleProduct,
    updateProduct,
    createProduct,
    deleteProduct,
    uploadImage
} = require('../controllers/productController');
const { getSingleProductReview } = require('../controllers/reviewController');

const router = express.Router();

router
    .route('/')
    .get(getAllProduct)
    .post([authenticateUser, authorizePermissions('admin')], createProduct);

router
    .route('/uploadImage')
    .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
    .route('/:id')
    .get(getSigleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

router.route('/:id/reviews').get(getSingleProductReview);
module.exports = router;