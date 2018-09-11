const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    age:{
        type:Number,
        required:true,
    },
    userid:{
        type:String,
        required:true,
        unique:true,
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});
module.exports = mongoose.model('User',userSchema);