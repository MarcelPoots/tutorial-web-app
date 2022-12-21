const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()


const port = process.env.PORT || 3000

const user = {
    name : 'Marcel',
    userName : '',
    roles : ['USER', 'DEVELOPER']
}

app.post("/authenticate", (req, res)=>{

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    const [username, password] = credentials.split(':')
    user.userName = username
    const token = jwt.sign(user, process.env.AUTHENTICATION_TOKEN_SECRET)
    
    //res.header.authorization = 'Bearer ' + token
    //res.json({accessToken : token }
    res.setHeader('authorization','Bearer ' + token)
    return res.status(200).json({result:'success'})
})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})