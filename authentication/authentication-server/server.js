const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()


const port = process.env.PORT || 3000

const user = {
    name : "Marcel",
    roles : ["USER", "DEVELOPER"]
}

app.post("/authenticate", (req, res)=>{
    console.log('Request in comming')
    res.json(user);
})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})