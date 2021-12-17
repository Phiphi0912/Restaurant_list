const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!email || !password || !confirmPassword) {
    errors.push({ message: '除了名字外，所有欄位皆為必填！' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼兩者不相符！' })
  }

  if (errors.length) {
    return res.render('register', {
      errors, name, email, password, confirmPassword
    })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此信箱已經註冊過！' })
        res.render('register', { errors, name, email, password, confirmPassword })
      }

      return bcrypt
        .genSalt(12)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '已成功登出！')
  res.redirect('/users/login')
})

module.exports = router