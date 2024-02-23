// require('dotenv').config();
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config({
    path:'./env'
})

import connectDB from "./db/index.js";


connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
})




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







