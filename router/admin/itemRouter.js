const express = require('express')
const router = express.Router()

const controller = require('../../controller/admin/itemController')

router.put('/add' , controller.addItem)

router.delete('/remove', controller.removeItem)

router.patch('/update', controller.updateItem)

router.patch('/update/quantity', controller.updateQuantity)

router.patch('/update/price', controller.updatePrice)

router.put('/image/add', controller.addItemImage)

router.delete('/image/remove', controller.removeItemImage)

router.get('/details/:id?', controller.getItem)

router.put('/tag', controller.addTag)

router.delete('/tag', controller.removeTag)

module.exports = router
