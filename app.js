const express = require('express')
const session = require('cookie-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const flash = require('connect-flash')
const app = express()


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const port = process.env.PORT
//wewewe
//使用const routes = require('./routes')的話也會自動去找到index
const routes = require('./routes/index')
const usePassport = require('./config/passport')
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', "handlebars")


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))


app.use(express.urlencoded({ extended: true }))

//要連結本地css一定要設定這個，此外已經設定為public資料夾，所以路徑從/stylesheets開始即可
app.use(express.static('public'))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())//注意要()
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use(routes)


app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})