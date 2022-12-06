const mongoose = require("mongoose");

const bookingsSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
    },
    email :{

        type:String,
        required :true,
        unique : true
    },
   password :{
        type:String,
        required : true,
        
    },
    password_salt :{
        type:String
 }
})


//now we need to create a collections
const registers = new mongoose.model("registers",bookingsSchema);
module.exports = registers;