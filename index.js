const express = require('express')
const Gun = require('gun')

const app = express()
app.use(Gun.serve)

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`)
})

Gun({ web: server })