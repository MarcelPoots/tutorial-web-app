const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Principal = require('./models/principal')

const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

const app = express()

const port = process.env.PORT || 3000

const users = []

app.post("/authenticate", async (req, res) => {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    const [username, password] = credentials.split(':')

    try {
        const user = await Principal.findOne({ email: username } )
        if (!user) {
            console.log(username + ' niet gevonden')
            return res.status(404).json({ message: 'User not found' })
        }

        if (await bcrypt.compare(password, user.hashedPassword)) {
            const token = jwt.sign({ name: user.name, username: user.username, roles: user.roles }, process.env.AUTHENTICATION_TOKEN_SECRET, { expiresIn: '10S' })
            res.setHeader('authorization', 'Bearer ' + token)
            return res.status(200).json({ result: 'success' })
    
        } else {
            return res.status(401).json({ result: 'failure' })
        }

    } catch (err) {
        console.log('Error ' + err)
    }

})

app.post("/register", async (req, res) => {

    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' })
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1]
    const registerInfo = Buffer.from(base64Credentials, 'base64').toString('UTF-8')
    const [username, password, name] = registerInfo.split(':')

    try {
        const obj = await Principal.findOne({ email: username } )
        if (obj) {
            console.log(obj.email + ' gevonden')
            return res.status(401).json({ message: obj.email + ' already registered' })
        }
    } catch (err) {
        console.log('Error ' + err)
    }



    const hashedPassword = await bcrypt.hash(password, 10)
    const principal = new Principal({
        email: username,
        name: name,
        hashedPassword: hashedPassword,
        roles : ['USER']
    })

    try {
        console.log("Going to save : ", principal);
        await principal.save()
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

app.listen(port, () => {
    console.info('Server is up on port ' + port)
})
