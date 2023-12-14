const { Schema, model } = require('mongoose')

const prdSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true

    },
    images: {
        type: String,
        required: true, default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3DPRODUCT&psig=AOvVaw1elkhE2cMXmIaiZT04NGf9&ust=1700656232066000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLDUjqeM1YIDFQAAAAAdAAAAABAJ"
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },


})

const product = model('products', prdSchema)
module.exports = product