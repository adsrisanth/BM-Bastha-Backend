const express = require('express')

const router = express.Router();

const controller = require('../../controller/user/cartController')

router.get('/all_items', controller.getCartItems)

router.post('/add', controller.addToCart)

router.post('/update/item', controller.updateCartItem)

router.post('/delete', controller.removeItemFromCart)

module.exports = router