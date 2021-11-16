const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
const mongoose = require('mongoose')
const db = mongoose.connection
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000


mongoose.connect('mongodb://localhost/restaurant')

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurant/new', (req, res) => {
  res.render('new')
})

app.get('/restaurant/:id', (req, res) => {
  const restaurant = restaurantList.find((item) => item.id === Number(req.params.id))
  res.render('show', restaurant)
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.filter((item) => item.name.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword))

  res.render('index', { restaurantList: restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Running on the http://localhost:${port}`)
})