const path = require('path')
const express = require('express')
const ejs = require('ejs')


const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view-engine', 'ejs')
app.set('views', viewsPath)

 
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.urlencoded({extended : false}))

app.get('', (req, res)=>{

    res.render('index.ejs', {
        title: 'Customer portal...'
    })
})

app.get('/login', (req, res)=>{
    res.render('login.ejs', {
        title: 'Login page'
    })
})

app.post('/login', (req, res)=>{
    res.render('index.ejs', {
        title: 'Bla logged in'
    })
})

app.get('/logout', (req, res)=>{
    res.render('login.ejs', {
        title: 'Login page'
    })
})

app.get('/register', (req, res)=>{
    res.render('register.ejs', {
        title: 'Register page'
    })
})

app.post('/register', (req, res)=>{
    console.log('Logged in ' + req.body.name)
    res.render('index.ejs', {
        title: 'Login page'
    })

})

app.get('/search', (req, res) =>{
    res.send({ name : 'john', info : 'good guy'});
})




// This route will handle all the requests that are 
// not handled by any other route handler. In 
// this hanlder we will redirect the user to 
// an error page with NOT FOUND message and status
// code as 404 (HTTP status code for NOT found)
app.all('*', (req, res) => {
    res.render('404.ejs', {errorMessage:'Error 404: The page could not be found', href:"./css/styles.css"})
});

app.listen(port, ()=>{
    console.info('Server is up on port ' + port)
})
