const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
passportLocalMongoose = require('passport-local-mongoose');
const SALT_ROUND = 10;
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        index:true,
        unique:true,
    },
    userid:{
        type:String,
        required:true,
        index:true,
        unique:true,
    },
    password:{
        type:String,
        index:true,
        required:true,
    },
    createdAt:{
        type:Date,
        index:true,
        default:Date.now,
    },
},{collection:"users"});

userSchema.index({'userid':1},{unique:true});

userSchema.pre('save', function (next){
    const user = this;
    if(!user.isModified("password")){
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(SALT_ROUND), null);
        return next();
    }
});

userSchema.methods.comparePassword = function (password) {
    const user = this;
    return bcrypt.compareSync(password, user.password);
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);