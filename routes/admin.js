const express = require('express');
const multer = require('multer');
const fs=require('fs');
const path = require('path')
const router = express.Router()
const collectedData = require('../model/collectedData');
const jwt = require('jsonwebtoken');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

//Function to verify adminToken
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

//Function to clear a specific directory upon which it gets called
const clearDir =(directory)=>{
  fs.readdir(directory,(err,files)=>{
    if (err) throw err;
    for (const file of files){
      fs.unlink(path.join(directory,file),err=>{
        if (err) throw err; 
      })
    }
  })
}

//Setting up Nodemailer
const nodeM= require('nodemailer');
const send= nodeM.createTransport({
    service: 'gmail',
    auth:{
        user: 'ottomailertest@gmail.com',
        pass: 'taol hrda mqwe vhoo'
}}) 

//Request to recieve data based on the batch clicked
router.post('/batch/:batch', tokenVerify, async (req, res) => {
  let batch = req.params.batch;
  let batchList = await collectedData.find({batch:batch}).then((data)=>{
    res.send(data)
  })
});

//Multer integration and E-Mail writing
const uploads = multer({dest:__dirname + "/uploads"})
router.post('/result', tokenVerify,uploads.array("file"),(req, res)=>{
  const mailData= req.body;
  const fileData =req.files;
  let batch = req.body.batch;
  const attach = fileData.map(file => ({
    filename: file.originalname,
    path: file.path
  }));
  var mailInfo = {
      from: 'ottomailertest@gmail.com',
      to: mailData.recieverMail,
      subject: `Test results - ${batch}`,
      html: `<html>
              <p>${mailData.textAttach}</p><br/>
              <p>Please find the attachments/links below:</p><br/><br/>
              <p>${mailData.resultLink}</p>
            </html>`, 
      attachments: attach,
  }
  send.sendMail(mailInfo, function(err, info){      
      if(err){
          res.status(400).json({message: err.message})  
          clearDir(__dirname+"/uploads")       
      }else{
          console.log('Email has been sent '+ info.response);      
          res.status(200).send({message:'success','Email has been sent ':info.response})
          clearDir(__dirname+"/uploads")
  }
})
})

module.exports=router;