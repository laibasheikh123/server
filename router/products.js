const express = require('express')
const router = express.Router()

const { create_product,all_product } = require('../controller/products')


router.get('/all-product',all_product)
router.post('/create-product',create_product)



module.exports = router