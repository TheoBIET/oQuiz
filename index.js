require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3003;
const router = require('./app/router');

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(PORT, () => {
    console.log(`Server listen at http://localhost:${PORT}`);
})