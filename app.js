const express = require('express')
const exphbs = require('express-handlebars')
const PORT = process.env.PORT || 3000

const methodOverride = require('method-override')
const routes = require('./routes/index')

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

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(PORT, () => {
  console.log(`Running on the http://localhost:${PORT}`)
})