const mongoose = require('mongoose');
passportLocalMongoose = require('passport-local-mongoose');
User = require('./user');
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

function findMaxNumber(article, limitNumber) {
    return new Promise((resolve, reject) => {
        mongoose.model('Board', boardSchema).find({userid:article.userid}).sort({number:-1}).limit(limitNumber)
            .then((result) => {
                if (result.length == 0) {
                    resolve(0);
                } else {
                    resolve(result[0].number);
                }
            });
    });
}

boardSchema.pre('save', function(next) {
   const article = this;
   let maxNumber = undefined;
   findMaxNumber(article, 1)
       .then((maxArticleNum) => {
           maxNumber = maxArticleNum + 1;
           this.number = maxNumber;
           return User.updateOne({userid: article.userid}, {$set: {maxNumber: maxArticleNum}});
       }).then((result) => {
           console.log('boardSchema - "save" / user update result : ',result);
           next();
   });
});

boardSchema.pre('remove', function(next) {
    const article = this;
    console.log('boardSchema - "remove" / this : ', article);
    Promise.all([findMaxNumber(article, 1), findMaxNumber(article, 2)])
        .then((result) => {
            firstNumber = result[0];
            secondNumber = result[1];
            if (firstNumber === article.number) { return secondNumber; }
            else { return firstNumber; }
        }).then((targetNumber) => {
            return User.updateOne({userid:article.userid}, {$set:{maxNumber:targetNumber}});
        }).then((result) => {
            console.log('boardSchema - "remove" update user number : ', result);
            next();
    });
});

boardSchema.methods.getUserBoard = function (userid) {
    mongoose.model('Board', boardSchema).find({userid:userid})
};

module.exports = mongoose.model('Board',boardSchema);