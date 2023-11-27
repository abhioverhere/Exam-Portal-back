const mongoose=require ('mongoose');
const student=mongoose.Schema({
    name:String,    
    email:String,    
    password:String,
    regComp:Boolean,
    isElig:Boolean,
    isAdmin:Boolean
})
const studentdata=mongoose.model('loggerdatas',student);
module.exports=studentdata;