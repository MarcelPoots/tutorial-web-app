const path = require('path')
const express = require('express')
const hbs = require('hbs')
const dotenv = require('dotenv')
const http = require('http')
const bodyParser = require('body-parser')

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

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Customer portal'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About page',
        name: 'Marchello'

    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help page',  href:"./css/styles.css"
    })
})

app.get('/login', (req, res) =>{
    res.render('login', {
        title: 'Login please'
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
    
            if (response.statusCode === 200) {
                console.log(response.headers)
                res.render('index', {title: 'Successfull Login'})
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

app.get('/logout', (req, res) =>{
    res.render('login', {
        title: 'Successfull logged out'
    })
})

app.get('/register', (req, res) =>{
    res.render('register', {
        title: 'Register'
    })
})

app.post('/register', (req, res) =>{
    //const hashedPassword = await bcrypt.hash(password, 10)
    res.render('index', {
        title: 'Successfull register'
    })
})

app.get('/help/*', (req, res) =>{
    res.render('404', {errorMessage:'The help topic could not be found', href:"../css/styles.css"})
})

app.get('*', (req, res) =>{
    res.render('404', {errorMessage:'Error 404: The page could not be found', href:"./css/styles.css"})
})

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
