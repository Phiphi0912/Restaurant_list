const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurantList })
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
  console.log(`Running on the localhost:${port}`)
})