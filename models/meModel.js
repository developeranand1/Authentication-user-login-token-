const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const meSchema = new Schema({

  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Me"
    },
    username:{
        type:String,
        required:[true,"Please add the user name"]
    },
    email:{
        type:String,
        required:[true,"Please add the email address"],
        unique:[true, "Email Address is already taken!"]
    },
    password:{
        type:String,
        required:[true,"Please add the user password"]
    },
},

{
    timestamps:true
}
);


module.exports = mongoose.model("Me", meSchema)