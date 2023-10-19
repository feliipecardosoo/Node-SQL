const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/',(req, res) => {
    res.render('home')
})

app.get('/books/:id', (req,res) => {
    const id = req.params.id

    const myQuery = `SELECT * FROM books WHERE id = ${id}`

    pool.query(myQuery, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const book = data[0]
        res.render('book', {book})
    })
})

app.get('/books/edit/:id', (req,res) => {
    const id = req.params.id

    const myQuery = `SELECT * FROM books WHERE id = ${id}`

    pool.query(myQuery, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const book = data[0]
        res.render('editbook', {book})
    })
})

app.post('/books/insertbook', (req,res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const myQuery = `INSERT INTO books (??, ??) VALUES (?,?)`
    const data = ['title', 'pageqty', title, pageqty]

    pool.query(myQuery, data, function (err){
        if (err) {
            console.log(err)
        } 
        console.log(`Titulo inserido ${title} pagina inserida ${pageqty}`)
        res.redirect('/books')
    })
}) 

app.get('/books', (req, res) => {
    const myQuery = 'SELECT * FROM books'

    pool.query(myQuery, function (err,data){
        if (err) {
            console.log(err)
            return
        }

        const books = data
        res.render('books', {books})
    })
})

app.post('/books/updatebook', (req, res) => {  
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const myQuery = `UPDATE books SET title = ?, pageqty = ? WHERE id = ?`
    const data = [title,pageqty,id]

    pool.query(myQuery, data, function(err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const mysql = `DELETE FROM books WHERE id = ?`
    const data = [id]

    pool.query(mysql, data, function (err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)
