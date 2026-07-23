const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema= new Schema({
    comment:String,
    rating:{
      type:Number,
      min:1,
      max:5
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    ownerResponse: {
      type: String,
      default: ""
    },
    aiSentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Positive'
    }
});

// schema define and exports commined here
module.exports= mongoose.model("Review",reviewSchema);