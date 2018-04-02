const express = require('express')
const app = express()

const path = require('path')

const keywordRouter = require('./router/keyword');
const authRouter = require('./router/auth');
const imageRouter = require('./router/imageRouter');
const DB = require('./db/db')

global.base_dir = path.join(__dirname,'..')

app.set('view engine', 'ejs');
app.use(express.static(path.join(global.base_dir,'public')))

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(authRouter(DB, app))

app.use((req,res,next) => {
  if (!req.user) {
    res.redirect('/login')
  } else {
    next()
  }
})


app.use(keywordRouter(DB))
app.use(imageRouter(DB))

app.listen(3000, () => {
  console.log("Server started")
})