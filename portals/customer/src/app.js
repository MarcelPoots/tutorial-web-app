const path = require('path')
const express = require('express')
const hbs = require('hbs')


const app = express()
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
    res.send({ name : 'john', info : 'good guy'});
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
