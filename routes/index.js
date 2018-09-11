const express = require('express');
const router = express.Router();
const app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res, next) => {
   res.render('mongoose');
});

app.listen(5000, () => {
    console.log('nodeboard server is running!');
});
