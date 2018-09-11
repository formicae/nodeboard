const mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');
const boardSchema = new mongoose.Schema({
    number:{
        type:Number,
        index:true,
    },
    userid:{
        type:String,
        required:true,
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

boardSchema.pre('save', function (next){
    const article = this;
    // update new article's number here
});


module.exports = mongoose.model('Board',boardSchema);