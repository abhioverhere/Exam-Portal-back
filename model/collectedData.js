const mongoose=require ('mongoose');
const userData=mongoose.Schema({
    firstName:String,
    middleName:String,
    lastName:String,
    batch:String,
    formMail:String,
    phone:String,
    dob : String,
    gender:String,   
})
const collectedData=mongoose.model('registerdatas',userData);
module.exports=collectedData;