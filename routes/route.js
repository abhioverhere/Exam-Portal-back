const express = require('express');
const regData = require('../model/student');
const collectedData = require('../model/collectedData');
const router = express.Router()
const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//Function to verify userToken
function tokenVerify(req,res,next){
  try{
    const token= req.headers.token;
    if(!token) throw new Error('Unauthorized');
    let pl=jwt.verify(token,'regapp');
    let plAdmin=jwt.verify(token,'regapp');
    if(!pl && !plAdmin) throw new Error('Unauthorized');
    next();
  }catch(error){
    res.status(401).send(error);
  }
}

//Checking Login data from DB and allocating token
router.post('/login',async (req, res) => {
  try {
    const { email, password } = req.body;
    const Ufound = await regData.findOne({ email, password });     
    const userCheck = await regData.findOne({ email });     
    const passCheck = await regData.findOne({ password });     
    if(Ufound){
      var checkElig = String(Ufound.isElig) //Checks eligibility for login 
      var adminCheck = String(Ufound.isAdmin) //Checks if the client is an Admin 
      if (adminCheck==="true"){
        const plAdmin = { email: email, password:password };
        const token = jwt.sign(plAdmin, 'regapp');
        res.status(200).send({ message: 'success-admin', token:token });
      } else if(checkElig==="true") {
        let pl ={ email:email, password:password };
        let token = jwt.sign(pl,'regapp');  
        var userName = Ufound.name        
        var regStatus = String(Ufound.regComp)     
        var eligStatus = String(Ufound.isElig)     
        res.status(200).send({message:'success-user', token:token, userName:userName, regStatus:regStatus, eligStatus:eligStatus });
      } else if(checkElig==="false") {
        res.status(401).send({error:'ineligible-login'});
      }
    }else if(!userCheck){
      res.status(404).send({error:'user-404'});   
    }else if(!passCheck){
      res.status(404).send({error:'wrong-pass'});       
    }else{
      res.status(404).send({error:'not-found'});
    }
  } catch (error) {
     console.error('Login Error:', error);
     res.status(500).send(error);
  } 
});

//Code to update the registration status of a user
router.put('/regupdate/:name',tokenVerify,async (req, res) => {
    try {      
      const userInfo = req.params.name
      const updateUser = await regData.findOneAndUpdate({ name:userInfo }, { regComp: true });
      if (updateUser) {
        res.status(200).send("Updated Successfully");
      } else {
        res.status(404).send("Data not found");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
})

//Code to collect the details of the user to Database
router.post('/upload',tokenVerify,async (req, res) => {
  const data = new collectedData({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      batch: req.body.batch,
      formMail :req.body.formMail,
      phone : req.body.phone,
      gender : req.body.gender
  })

  try {
      const dataSave = await data.save();
      res.status(200).send("Updated Successfully")
  }
  catch (error) {
      res.status(400).json({message: error.message})
  }
})

module.exports=router;