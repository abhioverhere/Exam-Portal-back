const nodeM= require('nodemailer');
const send= nodeM.createTransport({
    service: 'gmail',
    auth:{
        user: 'ottomailertest@gmail.com',
        pass: 'taol hrda mqwe vhoo'
}}) 

var mailInfo = {
    from: 'ottomailertest@gmail.com',
    to: 'abhiabhilashpat@gmail.com',
    subject: 'Nodemailer Test',
    text: 'Yaay.'
}

send.sendMail(mailInfo, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Email has been sent '+ info.response);
}})