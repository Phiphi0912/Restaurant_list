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
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/restaurant/new', (req, res) => {
  res.render('new')
})

app.post('/restaurant/create', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/restaurant/:id/detail', (req, res) => {
  return Restaurant.findById(req.params.id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

app.get('/restaurant/:id/edit', (req, res) => {
  return Restaurant.findById(req.params.id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurant/:id/edit', (req, res) => {
  return Restaurant.findByIdAndUpdate(req.params.id, req.body)  //前面放篩選條件，後面放更新物件
    .then(() => res.redirect(`/restaurant/${req.params.id}/detail`))
    .catch(error => console.log(error))
})

app.post('/restaurant/:id/delete', (req, res) => {
  if (!req.params.id) return

  return Restaurant.findById(req.params.id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  Restaurant.find({
    $or: [  //這裡使用mongoose提供的or 運算子
      { name: { $regex: keyword, $options: 'i' } }, //這裡使用mongodb提供使用正則表達式$regex操作符來進行搜尋
      { category: { $regex: keyword, $options: 'i' } } //options則可以用來使用其他的表達是，i則代表不分大小寫
    ]
  })
    .lean()
    .then((restaurants) => res.render('index', { restaurants, keyword }))
    .catch(error => console.log(error))
})



app.listen(port, () => {
  console.log(`Running on the http://localhost:${port}`)
})