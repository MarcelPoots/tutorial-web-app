const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = express()


const port = process.env.PORT || 3000

const user = {
    name : 'Marcel',
    userName : '',
    roles : ['USER', 'DEVELOPER'],
    hashedPassword: '$2b$10$kiEPGO0vnptDu93UqmjoOOI1pRhBzQLPtUoMS5x24T2kH/Lh7icPe'
}

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
        user.userName = username
        const token = jwt.sign(user, process.env.AUTHENTICATION_TOKEN_SECRET, {expiresIn: '5M'})
        res.setHeader('authorization','Bearer ' + token)
        return res.status(200).json({result:'success'})

    } else {
        return res.status(401).json({result:'failure'})
    }


})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
