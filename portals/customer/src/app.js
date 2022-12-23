const path = require('path')
const express = require('express')
const hbs = require('hbs')
const dotenv = require('dotenv')
const http = require('http')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const { stringify } = require('querystring')
const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')

dotenv.config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', isAuthenticated, (req, res)=>{
    res.render('index', {
        title: 'Customer portal'
    })
})

app.get('/about', isAuthenticated, (req, res)=>{
    res.render('about', {
        title: 'About page',
        name: 'Marchello'

    })
})

app.get('/help', isAuthenticated, (req, res)=>{
    res.render('help', {
        title: 'Help page',  href:"./css/styles.css"
    })
})

app.get('/login', isNotAuthenticated,  (req, res) =>{
    res.render('login', {
        title: 'Login'
    })
})

app.post('/login', (req, res) => {

    let credentials = req.body.email + ':' + req.body.password
    
    const options = {
        hostname: process.env.AUTHENTICATION_HOST_NAME,
        port: process.env.AUTHENTICATION_PORT,
        path: '/authenticate',
        headers: {'Authorization': `Basic ${Buffer.from(credentials).toString('base64')}`},
        method: 'POST'
    };

    http.request(options, (response) => {
        let data = ''
         
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        // Ending the response 
        response.on('end', () => {

            console.log('Body:', JSON.parse(data))
    
            if (response.statusCode === 200 && 
                response.headers.authorization && 
                response.headers.authorization.indexOf('Bearer ') !== -1) {

                const token =  response.headers.authorization.split(' ')[1]
                localStorage.setItem('token', token)
                const parsedJwt = parseJwt(token);

                res.render('index', {title: 'Welcome ' + parsedJwt.name})
            } else {
                res.render('login', {
                    title: 'Login error',
                    errorMessage : 'Reason: Authentication error'
                })
            }
        });
           
    }).on("error", (err) => {
        console.log("Error: ", err)
    }).end()
    
})

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function  isAuthenticated ( req, res, next) {
    const token = localStorage.getItem('token')
    var message = ''
    try {
        jwt.verify(token, process.env.AUTHENTICATION_TOKEN_SECRET )
        const parsedJwt = parseJwt(token);
        const roles = parsedJwt.roles;

        if (roles.find(role => role === 'USER')) {
            return next()
        }
    } catch (error) {
        localStorage.setItem('token', null) // clear token cookie
        message = error

        if (error.toString().includes('expired')) {
            message = 'Session has expired. Please login again'
        } else {
            message = 'Auhentication error'
        }

        console.error('ERROR: ' + error)
        // do nothing, could expired token
    }
    res.render('login', {
        title: 'Login', message : message
    })
}

function  isNotAuthenticated ( req, res, next) {
    
    const token = localStorage.getItem('token')
    if (!token) return next() // no token means, not logged in

    try {
        jwt.verify(token, process.env.AUTHENTICATION_TOKEN_SECRET )
        const parsedJwt = parseJwt(token);
        const roles = parsedJwt.roles;
        if (roles.find(role => role === 'USER')) {
            // User is still logged in
            res.redirect('/')        
        }
    } catch (error) {
        localStorage.setItem('token', null) // clear token cookie
        // Yes, user is not logged in, or even unknown
        return next()
        console.error('ERROR: ' + error)
    }

    // Else we seem to be logged in, just redirect to index
    res.redirect('/')
}

app.get('/logout', (req, res) =>{
    res.render('login', {
        title: 'Login'
    })
})

app.get('/register', isNotAuthenticated, (req, res) =>{
    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', async (req, res) =>{

    let registerinfo = req.body.email + ':' + req.body.password + ':' + req.body.name
        
    const options = {
        hostname: process.env.AUTHENTICATION_HOST_NAME,
        port: process.env.AUTHENTICATION_PORT,
        path: '/register',
        method: 'POST',
        headers: {'Authorization': `Basic ${Buffer.from(registerinfo).toString('base64')}`}
    };

    http.request(options, (response) => {
        let data = ''
         
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        // Ending the response 
        response.on('end', () => {

            console.log('Body:', JSON.parse(data))
    
            if (response.statusCode === 200) {
                console.log(response.headers)
                res.render('login', {title: 'Login', message :'Successfull register, please login'})
            } else {
                res.render('register', {
                    title: 'Register',
                    message : 'Reason: register error'
                })
            }
        });
           
    }).on("error", (err) => {
        console.log("Error: ", err)
        res.render('register', {
            title: 'Error: ' + err
        })
    
    }).end()


})

app.get('/help/*', isAuthenticated, (req, res) =>{
    res.render('404', {errorMessage:'The help topic could not be found', href:"../css/styles.css"})
})

app.get('*', (req, res) =>{
    res.render('404', {errorMessage:'Error 404: The page could not be found', href:"./css/styles.css"})
})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
