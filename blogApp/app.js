const express = require('express')
const app = express()
// initialize pg-promise library 
const pgp = require('pg-promise')()

const connectionString = 'postgress://localhost:5432/blog_app'

// initialize pg promise by using a connection string
// pgp(...) returns an object which contains functions to interact with the database
const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')
app.use(express.urlencoded())

// tell express to use mustache templating engine
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')


// the root page 
app.get('/', (req, res) => {
    db.any('SELECT * FROM blog_post;')
    .then(post => {
        // will show them the different posts
        // {just a random name: the name of this function}
        res.render('posts', {allPosts: post})
    })
})

// creating the different posts
app.post('/create-post', (req, res) => {
    //the two items i want the user to dictate
    const title = req.body.title
    const body = req.body.body

    // uses SQL to write the insert 
    // $1, $2... are used instead of template literals
    db.none('INSERT INTO blog_post (title, body) VALUES ($1, $2)', [title, body])
    .then(() => {
        res.redirect('/')
    })

})

// deleting an individual post
app.post('/delete-post', (req, res) => {
    const postId = req.body.postId

    db.none('DELETE FROM blog_post WHERE post_id = $1', [postId])
    .then(() => {
        res.redirect('/')
    })
})


app.listen(3000, () => {
    console.log('Server 3000 is running...')
})