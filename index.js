const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');

const rssParser = require('./rss-parser.js')

const rssRouter = require('./routes/rss-router')

const db = require('./db')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload());

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('<form action="/api/feed" method="POST"><input type="text" name="url"><input type="submit"></form>')
})

app.use('/api', rssRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))