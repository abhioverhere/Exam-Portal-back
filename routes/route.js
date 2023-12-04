const express = require('express');
const multer = require('multer');
const regData = require('../model/student');
const collectedData = require('../model/collectedData');
const sendMail = require('./admin.js')
const router = express.Router()
const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

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

router.post('/login',async (req, res) => {
  try {
    const { email, password } = req.body;
    const Ufound = await regData.findOne({ email, password });
    if(Ufound){
      var checkElig = String(Ufound.isElig)  
      var adminCheck = String(Ufound.isAdmin)
      if (adminCheck==="true"){
        const plAdmin = { email: email, password:password };
        const token = jwt.sign(plAdmin, 'regapp');
        res.status(200).send({ message: 'success-admin', token:token });
      } else if(checkElig==="true") {
        let pl ={ email:email, password:password };
        let token = jwt.sign(pl,'regapp');  
        var userName = Ufound.name        
        var regStatus = String(Ufound.regComp)     
        res.status(200).send({message:'success-user', token:token, userName:userName, regStatus:regStatus });
      } else if(checkElig==="false") {
        res.status(401).send(new Error('ineligible-login'));
      }
    }else{
      res.status(404).send(new Error('not-found'));
    }
  } catch (error) {
     console.error('Login Error:', error);
     res.status(500).send(error);
  } 
});

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

router.post('/batch/:batch', tokenVerify, async (req, res) => {
  let batch = req.params.batch;
  let batchList = await collectedData.find({batch:batch}).then((data)=>{
    res.send(data)
  })
});

module.exports=router;