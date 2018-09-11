const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/user');
const connect = require('../schemas/index');
connect();

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField:'userid',
        passwordField:'password',
        session:true,
        passReqToCallback: false,
    }, (userid, password, done) => {
        User.findOne({userid:userid})
            .then((user) => {
                if (!user){
                    return done(null, false, {message:'No corresponding ID ! try again.'});
                } else {
                    const tempData = {valid:user.comparePassword(password), user:user};
                    return tempData;
                }
            }).then((tempData) => {
                if (tempData.valid) {
                    return done(null, tempData.user);
                } else {
                    return done(null, false, {message:'Invalid password! check again'});
                }
        }).catch((e)=>console.log(e));
    }));

    passport.serializeUser((userid, done) => {
        done(null, userid);
    });

    passport.deserializeUser((userid, done) => {
        User.findOne({userid:userid})
            .then(user => {
                const data = {username:user.username, userid:user.userid, number:user.number,createdAt:user.createdAt};
                done(null, data);
            })
            .catch(err => done(err));
    });
}