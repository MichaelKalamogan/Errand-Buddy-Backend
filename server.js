// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express();
const PORT = process.env.port || 3000

const userRouter = require('./routes/users')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}`
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// =======================================
//              MIDDLEWARES
// =======================================
app.use(express.json({ extended: false }))


// =======================================
//              ROUTES
// =======================================

app.get('/', (req, res) => {
    res.send('API working')
})

app.use('/api/users', userRouter)
// app.use('/api/auth', authRouter)
// app.use('/api/profile', profileRouter)
// app.use('/api/posts', postsRouter)

// =======================================
//             Error Handler
// =======================================

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
// })

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