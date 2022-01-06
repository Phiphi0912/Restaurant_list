const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant.json').results

const db = require('../../config/mongoose')

const seed_users = [
  {
    name: 'user_1',
    email: 'user1@example.com',
    password: '12345678',
    userIndex: [0, 1, 2]
  },
  {
    name: 'user_2',
    email: 'user2@example.com',
    password: '12345678',
    userIndex: [3, 4, 5]
  }
]

db.once('open', () => {
  Promise.all(
    Array.from(seed_users, user => {
      return bcrypt
        .genSalt(12)
        .then(salt => bcrypt.hash(user.password, salt))
        .then(hash => User.create({
          name: user.name,
          email: user.email,
          password: hash
        }))
        .then(newUser => {
          const userId = newUser._id
          const userRestaurant = []
          user.userIndex.forEach(index => {
            restaurantList[index].userId = userId
            userRestaurant.push(restaurantList[index])
          })
          return Restaurant.create(userRestaurant)
        })
    }))
    .then(() => {
      console.log('done')
    })
    .catch(err => console.log(err))
    .finally(() => process.exit())
})