const mongoose= require('mongoose');
const {Schema}= mongoose; 


const ContactSchema= new Schema({
    name: String,
    email: String, 
    message: String
})

module.exports= mongoose.model('Contact', ContactSchema)