const express = require('express')
// const mongoose = require('mongoose');
require('dotenv').config()
const app = express()
const port = process.env.SERVER_PORT;
var cors = require('cors')

app.use(cors())
app.use(express.json())

const user_route = require('./router/users')
const product_route = require('./router/products')

app.use(express.json())


app.use('/api', user_route)
app.use('/api', product_route)

// mongoose.connect(process.env.MONGO_URI)
//     .then((data) => console.log("Connected Successfully"))
//     .catch((err) => console.log(err))




app.listen(port, () => console.log(`App listening on http://localhost:${port}`))