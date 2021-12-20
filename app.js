const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT

const methodOverride = require('method-override')
const routes = require('./routes/index')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

const app = express()

require('./config/mongoose')

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    compare: function (a, b) {
      if (a === b) return 'selected'
    }
  }
}))

app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(routes)


app.listen(PORT, () => {
  console.log(`Running on the http://localhost:${PORT}`)
})