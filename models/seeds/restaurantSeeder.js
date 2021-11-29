const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results

const db = require('../../config/mongoose')

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  Restaurant.create(restaurantList)
    .then(() => console.log('restaurantSeeder update'))
    .catch(error => console.log(error))
})