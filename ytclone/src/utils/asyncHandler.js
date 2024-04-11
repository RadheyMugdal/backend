
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}




// or 


// const asyancHandler=(fn)=> async (req,res,next)  =>{
//      try{
//         await fn(req,res,next)
//      }
//      catch(err){
//         res.status(err.code || 300).json({
//             success:false,
//             massage:err.message
//         })
//      }
// };