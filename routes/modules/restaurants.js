const express = require('express')
const router = express.Router()
const { errorHandler } = require('../../middleware/errorHandler')
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/create', (req, res) => {
  const userId = req.user._id
  const body = req.body

  if (!body) return

  Restaurant.create({ ...body, userId }) //這裡加上...是因為req.body本身就是物件
    .then(() => res.redirect('/'))
    .catch(err => errorHandler(err, res))
})

router.get('/:id/detail', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  if (!_id) return

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => {
      if (!restaurant) return errorHandler(err, res)

      res.render('show', { restaurant })
    })
    .catch(err => errorHandler(err, res))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  if (!_id) return

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then((restaurant) => {
      if (!restaurant) return errorHandler(err, res)

      res.render('edit', { restaurant })
    })
    .catch(err => errorHandler(err, res))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const body = req.body
  if (!body) return

  return Restaurant.findOneAndUpdate({ _id, userId }, { $set: body })
    .then(() => res.redirect(`/restaurant/${req.params.id}/detail`))
    .catch(err => errorHandler(err, res))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  if (!_id) return

  return Restaurant.findOne({ _id, userId })
    .then(restaurant => {
      if (!restaurant) return errorHandler(err, res)

      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(err => errorHandler(err, res))
})

module.exports = router