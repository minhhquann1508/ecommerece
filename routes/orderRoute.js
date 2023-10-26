const express = require('express');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');
const {
    getAllOrder,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
} = require('../controllers//orderController');

const router = express.Router();

router
    .route('/')
    .get(authenticateUser, authorizePermissions('admin'), getAllOrder)
    .post(authenticateUser, createOrder);

router
    .route('/showAllMyOrders')
    .get(authenticateUser, getCurrentUserOrders)

router
    .route('/:id')
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder);

module.exports = router;