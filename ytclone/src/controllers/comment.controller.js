import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//add comment 
const addComment=asyncHandler(async (req,res)=>{
    const {videoId}=req.params
    if(!videoId){
        throw new ApiError(400,"Please provide a valid Video Id")
    }

    const user=req.user

    const {content}=req.body
    console.log(req.body);

    if(!content){
        throw new ApiError(400,'Content is required')
    }

    const comment=await Comment.create(
        {
            content,
            video:videoId,
            owner:user?._id
        }
    )
    
    return res
    .status(200)
    .json(new ApiResponce(200,comment,"Commented successfully"))

})


//delete comment 

const deleteComment=asyncHandler(async (req,res)=>{
    const {commentId}=req.params
    if(!commentId){
        throw new ApiError(400,"Invalid comment id provided")
    }

    const comment= await Comment.findById(commentId);

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(req.user?._id.toString() !== comment.owner.toString()){
        throw new ApiError(400,"You aren't delete this comment")
    }

    const { acknowledged}=await Comment.deleteOne({"_id":commentId})

    if(!acknowledged){
        throw new ApiError(500,"Something went wrong while deleting comment")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Comment deleted successfully"))
    
})



//update comment 

const updateComment=asyncHandler(async (req,res)=>{
    const {commentId}=req.params

    if(!commentId){
        throw new ApiError(400,"Comment id is required")
    }

    const comment=await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(req.user?._id.toString()!== comment.owner.toString()){
        throw new ApiError(401,"You cant update this comment")
    }
    const {content}=req.body
    const  updatedComment=await Comment.findByIdAndUpdate(commentId,{ $set :{content}},{new:true})
    
    return res
    .status(200)
    .json(new ApiResponce(200,updatedComment,"Comment updated successfully"))
})

const getVideoComment=asyncHandler (async (req,res)=>{

    const {videoId}=req.params
    let {page=1,limit=2}=req.query

    page=Number(page)
    page=Number(limit)
    const commentlist=await Comment.find({video:videoId})
    .skip((page-1)*limit)
    .limit(limit)
    .populate('video')
    .populate(
        {
            path:"owner",
            select:"username email fullName"
        }
    )

    if(!commentlist) {
        throw new ApiError(404,'No comments for this video available')
    }

    return res 
    .status(200)
    .json(new ApiResponce(200,{commentlist},'Comments fetched Successfully'))
})




export { addComment, deleteComment, updateComment };

