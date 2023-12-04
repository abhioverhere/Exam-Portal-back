const express = require('express');
const multer = require('multer');
const fs=require('fs');
const path = require('path')
const router = express.Router()
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const nodeM= require('nodemailer');
const send= nodeM.createTransport({
    service: 'gmail',
    auth:{
        user: 'ottomailertest@gmail.com',
        pass: 'taol hrda mqwe vhoo'
}}) 

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

const uploads = multer({dest:__dirname + "/uploads"})
router.post('/result', uploads.array("file"),(req, res)=>{
  const mailData= req.body;
  const fileData =req.files
  
  const attach = fileData.map(file => ({
    filename: file.originalname,
    path: file.path
  }));
  var mailInfo = {
      from: 'ottomailertest@gmail.com',
      to: mailData.recieverMail,
      subject: 'Nodemailer Test',
      html: `<html>
              <p>${mailData.textAttach} inna link</p><br/><br/>
              <p>${mailData.resultLink}</p>
            </html>`, 
      attachments: attach,
  }
  send.sendMail(mailInfo, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log('Email has been sent '+ info.response);
          clearDir(__dirname+"/uploads")
  }})
})

module.exports=router;