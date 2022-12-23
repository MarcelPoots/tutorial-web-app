const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express()

const port = process.env.PORT || 3000

const users = []

app.post("/authenticate", async (req, res)=>{

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    const [username, password] = credentials.split(':')

    const user = users.find(user => user.username === username)
    if (!user) {
        console.error('User ' + username + ' not found.')
        return res.status(404).json({ message: 'User not found' })
    }

    if (await  bcrypt.compare(password, user.hashedPassword) ) {
        const token = jwt.sign({name: user.name, username: user.username, roles: user.roles}, process.env.AUTHENTICATION_TOKEN_SECRET, {expiresIn: '10S'})
        res.setHeader('authorization','Bearer ' + token)
        return res.status(200).json({result:'success'})

    } else {
        return res.status(401).json({result:'failure'})
    }

})

app.post("/register", async (req, res)=>{

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1]
    const registerInfo = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    const [username, password, name] = registerInfo.split(':')

    const user = users.find(user => user.username === username)
    if (user) {
        return res.status(401).json({ message: 'User already registered' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    users.push({ name: name, username : username, hashedPassword: hashedPassword , roles: ['USER']})
    console.log(users)

    return res.status(200).json({ message: 'Success' })

})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
