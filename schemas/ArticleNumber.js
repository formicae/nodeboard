const mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');
const numberSchema = new mongoose.Schema({
    number:{
        type:Number,
        index:true,
        required:true,
    },
    userid:{
        type:String,
        index:true,
        required:true,
        unique:true
    },
},{collection:"maxArticleNumber"});

numberSchema.index({'userid':1},{unique:true});

module.exports = mongoose.model('ArticleNumber',numberSchema);