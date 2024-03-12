const express = require('express');

const router = express.Router();

const controller = require('../../controller/user/orderController')

router.post('/place', controller.placeOrder)

router.post('/cancel', controller.cancelOrder)

router.get('/list', controller.getOrderList)

router.get('/detail', controller.getOrderDetails)

router.post('/rate_review' , controller.submitReviewRating)

module.exports = router
