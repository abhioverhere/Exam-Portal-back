const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const path=require('path');
const userRouter=require('./routes/route.js');
const adminRouter=require('./routes/admin.js');
require('dotenv').config();

const app= express();
// app.use(express.static(path.join(__dirname,"frontend","build")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const mongoUrl=process.env.mongoUrl;
mongoose.connect(mongoUrl)
.then(() => {
    console.log("Connected to ExamDB");
  })
  .catch((error) => {
    console.error("Error connecting to ExamDB:", error);
  });

//Setting basic backend API routes
// app.get("/",(req,res)=>{res.sendFile(path.join(__dirname,"frontend","build","index.html"));});
app.use('/user',userRouter);  
app.use('/admin',adminRouter);  

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})