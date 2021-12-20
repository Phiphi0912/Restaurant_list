const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth')

router.use('/auth', auth)
router.use('/restaurant', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)


module.exports = router