const express = require('express')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    console.log('Request to /')
    res.send("hello!")
})

app.get('/sample', (req, res) => {
    console.log('sample')
    res.send("sample")
})

app.listen(port, () => {
    console.log(`app started on port ${port}. Press Ctrl+c to shut down`)
})