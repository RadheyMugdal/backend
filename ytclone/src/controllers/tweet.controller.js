import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet=asyncHandler(async (req,res)=>{
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Content is required")
    }

    const tweet =await Tweet.create(
        {
            content,
            owner:req.user?._id
        }
    )

    if(!tweet){
        throw new ApiError(500,'Something went wrong while  creating the tweet')
    }

    return res
    .status(200)
    .json(new ApiResponce(200,tweet,"Tweet created successfully"))
})


const getUserTweets=asyncHandler(async (req,res)=>{
    const tweets=await Tweet.find({owner:req.user?._id})
    if(tweets.length===0){
        throw new ApiError(404,"No Tweets found for this user")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,tweets,"Tweets Fetched successfully"))

})

const updateTweet=asyncHandler(async (req,res)=>{
    const {tweetId}=req.params
    if(!tweetId){
        throw new ApiError(400,"Invalid request , please provide a valid tweet id")
    }
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Please provide a valid content to update the tweet ")
    }

    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,'No Tweet Found With Given ID')
    }

    if(tweet?.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(401,"You are not authorized to perform this action")
    }

    const updatedtweet=await Tweet.findByIdAndUpdate(tweetId,{$set:{content}},{new:true})

    if(!updatedtweet){
        throw new ApiError(404,"The tweet with given id was not found")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,updatedtweet, "Tweet has been updated Successfully"))
})

//delete tweet
const deleteTweet=asyncHandler(async (req,res)=>{
    const  {tweetId} = req.params;
    if(!tweetId){
        throw new ApiError(400,'Invalid Request Please provide a valid tweet Id')
    }
    const tweet= await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,'No Tweet Found With Given ID')
    }
    if(tweet?.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(401,'You do not have permission to perform this Action')
    }

    const {acknowledged}=await Tweet.deleteOne({_id:tweetId})

    if(!acknowledged){
        throw new ApiError(500,'Server Error while deleting the Tweet')
    }

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Tweet Has Been Deleted Succesfully"));
})
export { createTweet, deleteTweet, getUserTweets, updateTweet };

