import { Like } from "../models/like.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike=asyncHandler(async (req,res)=>{
    const {videoId}=req.params;
    if(!videoId){
        throw new ApiError(400,"Please provide video id");
    }

    const isLiked=await Like.find(
        {
            video:videoId,
            likedBy:req.user?._id
        }
    )

    if(isLiked.length === 0){
        const like= await Like.create(
            {
                video:videoId,
                likedBy:req.user?._id
            }
        )

        return res.status(200).json(new ApiResponce(200,like,"Video Liked Successfully"))
    }else{
        const like=await Like.findByIdAndDelete(isLiked[0]?._id)
        return res.status(200).json(new ApiResponce(200,like,"Video Unliked Successfully"))

    }
})


const toggleCommentLike=asyncHandler(async (req,res)=>{
    const {commentId}=req.params
    if(!commentId){
        throw new ApiError(400,'Invalid Comment Id')
    }
    const likedComment=await Like.find(
        {
            likedBy: req.user?._id,
            comment:commentId
        }
    )

    if(likedComment.length ===0){
        const likeCmt=await Like.create({
            likedBy:req.user?._id,
            comment:commentId
        })

        return res.status(200).json(new ApiResponce(200,likeCmt,"Comment liked successfully"))
    }else{
       const likeCmt= await Like.findByIdAndDelete(likedComment[0]?._id)

        return res.status(200).json(200,likeCmt,"Comment unliked successfully")
    }
})


const toggleTweetLike=asyncHandler(async (req,res)=>{
    const {tweetId}=req.params
    if(!tweetId){
        throw new ApiError(400,"Invalid Tweet ID")
    }

    const tweetliked=await Like.find(
        {
            likedBy:req.user?._id,
            tweet:tweetId
        }
    )
    if(tweetliked===0){
        const tweet =await Like.create({
            likedBy:req.user?._id,
            tweet:tweetId,
        })
        if(!tweet){
            throw new ApiError(500,'Server Error')
        }

        return res
        .status(200)
        .json(new ApiResponce(200,tweet,"Tweet Liked successfully"))
    }else{
        const deletedtweet=await Like.findByIdAndDelete(tweetId)
        if(!deletedtweet){
            throw new ApiError(500,'Server error while deleting the tweet')
        }
        return res
        .status(200)
        .json(new ApiResponce(200,deletedtweet,"Tweet UnLiked Successfully"))
    }
})

const getLikedVideos=asyncHandler(async (req,res)=>{
    // const videos=await Like.aggregate([
    //     {
    //         $match :{likedBy:req.user?._id}
    //     },
    //     {
    //         $lookup:{
    //             from:"videos",
    //             localField:"video",
    //             foreignField:"_id",
    //             pipeline:[
    //                 {
    //                     $project:{
    //                         videoFile:1,
    //                         thumbnail:1,
    //                         title:1,
    //                         description:1,
    //                         duration:1,
    //                         views:1,
    //                         owner:1
    //                     }
    //                 }
    //             ],
    //             as:"likedvideos",
    //         }
    //     },
    //     {
    //         $addFields:{
    //             'likedvideo':{
    //                 $first:'$likedvideo'
    //             }
    //         }
    //     }

    // ])

        // const likedVideos = await Like.aggregate([
        //     {
        //         $match: { likedBy: req.user?._id } // Filter by the user's ID
        //     },
            
        //     {
        //         $lookup: {
        //             from: "videos",
        //             localField: "video",
        //             foreignField: "_id",
        //             as: "likedVideo", // Alias for the joined video document
        //             pipeline:[
        //                 {
        //                     $project:{
        //                         owner:1
        //                     }
        //                 }
        //             ]
        //         }
        //     },
            
            
        // ]);
    
        const likedVideos=await Like.find({likedBy:req.user?._id,comment:null,tweet:null})
        if(!likedVideos || likedVideos.length===0){
            throw new ApiError(404, "No videos found");
        }

        return res
        .status(200)
        .json(new ApiResponce(200,likedVideos,"Liked videos found successfully"))

})

export { getLikedVideos, toggleCommentLike, toggleVideoLike };

