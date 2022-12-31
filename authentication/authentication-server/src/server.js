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

    const user = users.find(user => user.username === username)
    if (!user) {
        console.error('User ' + username + ' not found.')
        return res.status(404).json({ message: 'User not found' })
    }

    if (await bcrypt.compare(password, user.hashedPassword)) {
        const token = jwt.sign({ name: user.name, username: user.username, roles: user.roles }, process.env.AUTHENTICATION_TOKEN_SECRET, { expiresIn: '10S' })
        res.setHeader('authorization', 'Bearer ' + token)
        return res.status(200).json({ result: 'success' })

    } else {
        return res.status(401).json({ result: 'failure' })
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

    await Principal.find({email : username}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("First function call : ", docs);

            if (docs.length > 0) {
                console.log(docs[0].email + ' gevonden')
                return res.status(401).json({ message: docs[0].email + ' already registered' })
            }
        }
    })
    


    const hashedPassword = await bcrypt.hash(password, 10)
    const principal = new Principal({
        email: username,
        name: name,
        hashedPassword: hashedPassword
    })

    try {
        await principal.save()
        return res.status(200).json({ message: 'Success' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


})

app.listen(port, () => {
    console.info('Server is up on port ' + port)
})
