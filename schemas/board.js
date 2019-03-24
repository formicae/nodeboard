const mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');
User = require('./user');
const boardSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        index:true,
    },
    imageFileName:{
        type:String,
        index:true,
    },
    title:{
        type:String,
        index:true,
        required:true,
    },
    content:{
        type:String,
        index:true,
    },
    createdAt:{
        type:Date,
        index:true,
        default:Date.now,
    },
},{collection:"board"});

boardSchema.index({'userid':1},{unique:true});

boardSchema.methods.getUserBoard = function (userid) {
    mongoose.model('Board', boardSchema).find({userid:userid})
};

module.exports = mongoose.model('Board',boardSchema);