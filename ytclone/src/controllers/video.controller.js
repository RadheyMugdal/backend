import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";

const getAllVideo=asyncHandler (async (req,res)=>{
    const videos=await Video.find({owner: req.user?._id})

    if(videos.length===0){
        throw new ApiError(404,"No video found for this user")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,videos,"Videos fetched successfully"));
})

const publishVideo=asyncHandler(async (req,res)=>{
        const {title,description}=req.body

        if(!title  && !description){
            throw new ApiError(408,"Title or description is empty")
        }

        const thumbnailLocalPath=req.files?.thumbnail[0]?.path;
        const videoLocalPath=req.files?.video[0]?.path;

        if(!videoLocalPath ){
            throw new ApiError(408,"Video is required")
        }
        if(!thumbnailLocalPath){
            throw new ApiError(408,"Thumbnail is required")
        }

        const videourl=await uploadonCloudinary(videoLocalPath);
        const thumbnailurl=await uploadonCloudinary(thumbnailLocalPath);

        if(!videourl ){
            throw new  ApiError(500,"Something went wrong while uploading video ")
        }
        if(!videourl ){
            throw new  ApiError(500,"Something went wrong while uploading thumbnail")
        }

       

        const video=await Video.create({
            videoFile:videourl?.url,
            thumbnail:thumbnailurl.url,
            title,
            description,
            views:0,
            isPublished:true,
            owner:req.user?._id,
            duration:videourl?.duration
        })

        const uploadedVideo=await Video.findById(video._id)

        return res
        .status(200)
        .json(new ApiResponce(200,uploadedVideo,"Video published successfully"))



})


const getVideoById=asyncHandler(async (req,res)=>{
    const {videoId}=req.params
    console.log(req.params);
    
    if(!videoId){
        throw new ApiError(408,"video Id is required")
    }
    let video=await Video.findById(videoId)

    if(!video.isPublished){
        throw new ApiError(403,"This video is not available right now.")
    }

    return res 
    .status(200)
    .json(new ApiResponce(200,video,"Got video successfully"))

})

const deleteVideo=asyncHandler(async (req,res)=>{
    const {videoId}=req.params;
    

    if(!videoId){
        throw new ApiError(400,'No valid video id provided')
    }
    
    const {_id}=req.user
    const video=await Video.findById(videoId)
    // console.log(video);
    if(!video){
        throw new ApiError(404,"Video not Found")
    }

    if(_id.toString()!==video.owner.toString()){
        return new ApiError(401,"You do not have permission to perform this action on the video")
    }



    const {acknowledged}=await Video.deleteOne({"_id":videoId})


    if(!acknowledged){
        throw new ApiError(500, "Something went wrong while deleting the video")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Video deleted successfully"))
})


//toggle publish status 


const togglePublishStatus=asyncHandler( async (req,res)=>{
    const {videoId}=req.params

    if(!videoId){
        throw new ApiError(400,"Invalid video Id")
    }

    const {_id}=req.user
    const video=await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,'Video Not found')
    }

    if(_id.toString()!==video?.owner.toString()){
        throw new ApiError(403,"You are not authorized to perform this action")
    }

    const isPublished= !video?.isPublished;
    const videoupdated=await Video.findByIdAndUpdate(videoId,{
        $set:{isPublished}
    },
    {
        new:true
    })


    if(!videoupdated){
        throw new ApiError(404,'No video found with given id')
    }


    return res
    .status(200)
    .json(new ApiResponce(200,videoupdated,"Publish status changed successfully"))
})

export { deleteVideo, getAllVideo, getVideoById, publishVideo, togglePublishStatus };

