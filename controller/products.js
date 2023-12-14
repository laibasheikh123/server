require('dotenv').config()
const { connect } = require('mongoose')
const prdSchema = require('../schema/products')



const create_product = async (req, res) => {
    const { name, price, images, brand, category } = req.body;
    try {
        await connect(process.env.MONGO_URI)
        await prdSchema.create({ name, price, images, brand, category })
        const allProducts = await prdSchema.find()
        res.status(201).json(
            {
                message: "Product Successfully Created",
                products: allProducts
            }
        )
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}


const all_product = async (req, res) => {
    try {
        await connect(process.env.MONGO_URI)
        const products = await prdSchema.find()
        res.status(201).json({ products })
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}



module.exports = { create_product, all_product }