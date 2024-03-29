// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
require('express-async-errors')
const mongoose = require('mongoose')
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 4000

const { createProxyMiddleware } = require('http-proxy-middleware');


const indexController = require('./controllers/IndexController')
const userRouter = require('./routes/users')
const errandRouter =  require('./routes/errands')
const paymentRouter =  require('./routes/payment')
const chatRouter = require('./routes/chat')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// =======================================
//              MIDDLEWARES
// =======================================
app.use(express.json({ extended: false }))
app.use(cors({origin: '*'}))

// =======================================
//              ROUTES
// =======================================

//Homepage
app.get(['/', '/errand-buddy'], indexController.home)
app.use('/api/users', userRouter)
app.use('/api/errands', errandRouter)
app.use('/api/chats', chatRouter)
app.use('/api/payment', paymentRouter )



// =======================================
//             Error Handler
// =======================================

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// =======================================
//              LISTENER
// =======================================
mongoose.connect( mongoURI, { dbName: 'Errand-Buddy',useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        app.listen(PORT, () => {
        console.log(`Errand Buddy app listening on port: ${PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })