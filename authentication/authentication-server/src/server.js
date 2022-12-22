const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express()

const port = process.env.PORT || 3000

const user = {
    name : 'Marcel',
    username : '',
    roles : ['USER', 'DEVELOPER'],
    hashedPassword: '$2b$10$kiEPGO0vnptDu93UqmjoOOI1pRhBzQLPtUoMS5x24T2kH/Lh7icPe'
}

const users = [user]

app.post("/authenticate", async (req, res)=>{

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    console.log(credentials)
    const [username, password] = credentials.split(':')
    //const hashedPassword = await bcrypt.hash(password, 10)

    //console.log(hashedPassword)

    if (await  bcrypt.compare(password, user.hashedPassword) ) {
        user.username = username
        const token = jwt.sign({name: user.name, username: user.userName, roles: user.roles}, process.env.AUTHENTICATION_TOKEN_SECRET, {expiresIn: '5M'})
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
    console.log('Register ' + registerInfo)
    const [username, password, name] = registerInfo.split(':')

    // const user = users.find(user => user.email === req.body.user.email)
    // if (user != null ) {
    //     return res.status(401).json({ message: 'User already registered' })
    // }
    const hashedPassword = await bcrypt.hash(password, 10)
    const registeredUser = { name: name, username : username, password: hashedPassword }
    users.push(registeredUser)
    console.log(users)

    return res.status(200).json({ message: 'Success' })

})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
