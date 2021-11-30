const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const sortSelection = req.query.sort
  const sortMethod = {}

  if (!keyword) return

  switch (sortSelection) {
    case 'asc':
      sortMethod.name_en = 'asc'
      break
    case 'desc':
      sortMethod.name_en = 'desc'
      break
    case 'category':
      sortMethod.category = 'asc'
      break
    case 'location':
      sortMethod.location = 'asc'
      break
  }

  Restaurant.find({
    $or: [     //這裡使用MongoDB提供的or運算子：{ $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
      { name: { $regex: keyword, $options: 'i' } }, //這裡使用mongodb提供使用正則表達式$regex操作符來進行搜尋
      { category: { $regex: keyword, $options: 'i' } } //options則可以用來使用其他的表達是，i則代表不分大小寫
    ]
  })
    .lean()
    .sort(sortMethod)
    .then((restaurants) => res.render('index', { restaurants, keyword, sortSelection }))
    .catch(error => console.log(error))
})

module.exports = router