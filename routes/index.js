const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./passport');
const session = require('express-session');
const User = require('../schemas/user');
const connect = require('../schemas/index');
connect();
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri:'mongodb://youngmo:Dldudah12!@127.0.0.1:27017/admin',
    database:'nodejs',
    collection:'users',
});
store.on('error', (err) => {
    console.log(err);
});

router.use(session({
    secret:'daodgabeg2#ADGAGASGAEWGdadadbagl',
    resave:true,
    saveUninitialized:true,
    cookie:{maxAge:100000,httpOnly:true},
    store:store,
    rolling:true,
}));
passportConfig(passport);
app.use(session({ key:'youngmo', secret:'mo', resave:true, saveUninitialized:true, }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));
app.use(passport.initialize());
app.use(passport.session());

function renderMainPage(res, title) {
    res.render('../views/index', {title:title});
}

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.prevUrl = 'authFail';
        res.redirect('/');
    }
};

router.get('/', (req, res, next) => {
    if (req.session.prevUrl === 'signup') {
        renderMainPage(res, 'Signup finished! please log in');
    } else if (req.session.prevUrl === 'authFail') {
        renderMainPage(res, 'Authentication failed!');
    } else if (req.session.prevUrl === 'logout') {
        renderMainPage(res, 'Log out safely!');
    } else {
        renderMainPage(res, ' --- Main page ---');
    }
});

router.post('/', (req, res, next) => {
    req.session.prevUrl = 'main';
    passport.authenticate('local', (err, user, info) => {
        const error = err || info;
        if (error) return renderMainPage(res, error.message);
        req.login(req.body.userid, (err) => {if (err) next(err) });
        res.redirect('/user');
    })(req, res, next);
});

function uniqueUserid(userid, callback) {
    User.findOne({userid:userid})
        .then((user) => {
            if (!user) {
                callback(true);
            } else {
                callback(false);
            }
        }).catch((err)=>{console.log('unique Userid error : ',err)});
}


router.get('/signup', (req, res, next) => {
    res.render('../views/signup', {title:'Make your ID here!'});
});

router.post('/signup', (req, res, next) => {
    console.log('signup - post request !');
    uniqueUserid(req.body.userid, (result) => {
        if (result) {
            const newUser = new User({username:req.body.username, userid:req.body.userid, password:req.body.password});
            newUser.save()
                .then((result) => {
                    req.session.prevUrl = 'singup';
                    res.redirect('/');
                }).catch((err) => {
                    console.log('error occured when saving user, (maybe same username or userid) : ',err);
            });
        } else {
            res.render('../views/signup', {title:'User id already exist! create another id'});
        }
    });
});

router.get('/user', ensureAuthenticated, (req, res, next) => {
    res.render('../views/user', {title:'user page', userid:req.user.userid});
});

router.post('/user', ensureAuthenticated, (req, res, next) => {
    res.clearCookie(req.body.userid);
    req.logout();
    req.session.prevUrl = 'logout';
    console.log('about to log out!');
    res.redirect('/');
});

module.exports = router;