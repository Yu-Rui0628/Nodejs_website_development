const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');



mongoose.connect('mongodb+srv://ruyu4807:ruyu4807@cluster0.8lvkiqm.mongodb.net/demo?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("Rui Yu Connected Succeed!"))
.catch(err => console.log("Rui Yu Cannot connect the database" + err));


const index = require('./app/routes/index');
const LoginPage = require('./app/routes/login');
const SignupPage = require('./app/routes/signup');
const checkoutPage = require('./app/routes/checkout');
const userPage = require('./app/routes/user');
const searchPage = require('./app/routes/search');
const itemPage = require('./app/routes/item');




app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'ssshhhhh',
    cookie: {maxAge: 60*60*1000},
    resave: true,
    saveUninitialized: true
}));

app.use('/',index);
app.use('/',LoginPage);
app.use('/',SignupPage);
app.use('/', checkoutPage);
app.use('/', userPage);
app.use('/', searchPage);
app.use('/', itemPage);



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});