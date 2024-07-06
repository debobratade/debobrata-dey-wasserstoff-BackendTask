const express = require('express')
const app = express()

app.get('/live', (req, res) => {
    res.sendStatus(200)
})

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Serving from server at port 3000" })
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})