const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['student', 'owner', 'admin'],
        default:'student'
    },
    phone:{
        type:String,
        default:''
    },
    collegeName:{
        type:String,
        default:''
    },
    budget:{
        type:Number,
        default:10000
    },
    gender:{
        type:String,
        enum:['Boys', 'Girls', 'Co-ed', 'Any'],
        default:'Any'
    },
    wishlist:[{
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }],
    isVerified:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);