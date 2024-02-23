// require('dotenv').config();
import dotenv from 'dotenv';
import express from 'express';
const app=express()

dotenv.config({
    path:'./env'
})

import connectDB from "./db/index.js";


connectDB();

// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERROR",error);
//             throw error
//         })
//         app.listen((process.env.PORT),()=>{
//             console.log(`Server is running on port ${process.env.PORT}`)
//         })
//     } catch (error) {
//         console.log("ERROR".error);
//     }
// })()







