const express = require('express');
const regData = require('../model/student');
const collectedData = require('../model/collectedData');
const router = express.Router()
const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

function tokenVerify(req,res,next){
  try{
    const token= req.headers.token;
    
    if(!token) throw new Error('Unauthorized');
    let pl=jwt.verify(token,'regapp');

    if(!pl) throw new Error('Unauthorized');
    next();

  }catch(error){
    res.status(401).send(error);
  }
}

router.post('/login',async (req, res) => {
  try {
    const { email, password } = req.body;
        const adminEmail = 'admin@gmail.com';
        const adminPass = 'admin123';

    if (email === adminEmail && password === adminPass){
      const plAdmin = { email: adminEmail };
      const token = jwt.sign(plAdmin, 'regapp');
      res.status(200).json({ message: 'Login Success', token });
    } else {
      const Ufound = await regData.findOne({ email, password });
      if (Ufound) {
        let pl ={ email:email, password:password };
        let token = jwt.sign(pl,'regapp');  
        var userName = Ufound.name        
        var regStatus = String(Ufound.regComp)     
        res.status(200).send({message:'Login Success', token:token, userName:userName, regStatus:regStatus });
      } else {
         res.status(401).send(new Error('Invalid credentials.'));
      }
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