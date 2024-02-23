
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponce from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadonCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken =await user.generateAccessToken()
        const refreshToken =await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    
    ///get user details from frontend 
    //validation -not emmpty
    //check if user already exists username ,email
    // check for images ,check for avatar
    // upload them to cloudinary ,avatar
    //create user object -create entry in db
    //remove password and refresh token feild from responce
    //check for user creation 
    //return responce

    const {username,fullName,email,password}=req.body


    // if(fullName ===""){
    //     throw new ApiError(400,"Full name cannot be empty","USER_NOT_CREATED");
    // }
    if(
        [username,email,password,fullName].some((feild)=> feild?.trim()==="")
    ){
        throw new ApiError(400,"One or more fields are empty");
    }
    
    const existedUser= await User.findOne({$or:[{username},{email}]})
    if(existedUser){
        throw new ApiError(409,"Username or email is taken");
    }
    //  console.log(req.files);
    const avatarLocalpath=req.files?.avatar[0]?.path
    // const coverimageLocalpath=req.files?.coverImage[0]?.path

    let coverimageLocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.coverImage.length >0){
        coverimageLocalpath=req.files.coverImage[0]?.path;
    }
    
    if(!avatarLocalpath){
        throw new ApiError(408,"Avatar file is required")
    }

    const avatar=await uploadonCloudinary(avatarLocalpath);
     const coverimage= await uploadonCloudinary(coverimageLocalpath)
    if(!avatar){
        throw new ApiError(408,"avatar feild is required");

    }

    const user=await User.create({
        username:username.toLowerCase(),
        fullName,
        avatar:avatar.url,
        coverImage:  coverimage?.url || "",
        password,
        email

    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user");

    }

    return res.status(201).json(
        new ApiResponce(200,createdUser,"User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponce(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})


//logout
const logoutUser =asyncHandler(async (req,res)=>{
          await User.findByIdAndUpdate(req.user._id,{
            $set :{
                refreshToken : undefined
            },
            new :true
          })
          const options={
            httpOnly:true,
            secure:true
          }
          return res
          .status(200)
          .clearCookie("accessToken",options)
          .clearCookie("refreshToken",options)
          .json( new ApiResponce(200,{},"user logged out successfully"))
})

const refreshAccessToken=asyncHandler( async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken 
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized REquest")
    }
   try {
     const decodedtoken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
     const user=await User.findById(decodedtoken?._id);
     if(!user){
         throw new ApiError(401,"Invalid Refresh Token")
     }
 
     if(user.refreshToken !== incomingRefreshToken){
         throw new ApiError(401,"Refresh token is expired or used")
     }
     const options={
         httpOnly:true,
         secure:true
     }
     const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)
     return res
     .status(200)
     .cookie("acessToken",accessToken)
     .cookie("refreshToken",refreshToken)
     .json(new ApiResponce(200,{user,accessToken,refreshToken},"Access Token Refreshed"))
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Refresh Token")
   }

})



const changeCurrentPassword=asyncHandler(async (req,res)=> {

    const {oldPassword,newPassword}=req.body
    const user =await User.findById(req.user?._id)
    if( await !user.isPasswordCorrect(oldPassword)){
        throw new ApiError(401,'Incorrect Current Password')
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    
    return res
    .status(200)
    .json(new ApiResponce(200,{},"Password has been changed successfully"));

})


//get current user

const getCurrentUser=asyncHandler (async (req,res)=>{
    

    return res
    .status(200)
    .json(new ApiResponce(200,req.user,"Current user fetched successfully"))

})



//update account details

const updateAccountDetails=asyncHandler(async (req,res)=>{
    const {fullName,email}=req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required");
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set :{fullName,email}
        },
        {new:true}
        ).select(" -password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponce(200,user,"Details updated successfully"))
})


//update user avatar
const updateUserAvatar=asyncHandler(async (req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }
    const avatar=await uploadonCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    await User.findByIdAndUpdate(req.user?._id ,
        {$set:{avatar}},
       
    )

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Avatar updated successfully"))

})


//update user cover image
const updateCoverImage=asyncHandler(async (req,res)=>{
    const coverimageLocalPath=req.file?.path
    if(!coverimageLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }
    const coverImage=await uploadonCloudinary(coverimageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on Cover Image")
    }

    await User.findByIdAndUpdate(req.user?._id ,
        {$set:{coverImage}},
       
    )

    return res
    .status(200)
    .json(new ApiResponce(200,{},"Cover image updated successfully"))

})


//get user channel profile

const getChannelProfile=asyncHandler(async (req,res)=>{
    const {username}=req.params
    if(!username?.trim()){
        throw new ApiError(400,"Username is missing")
    }
    const channel=await User.aggregate([
        {
            $match :{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup : {
                from :"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup : {
                from :"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },,
        {
            $addFields:{
                subscribersCount:{$size:"$subscribers"},
                channelsSubscribedToCount:{$size:"$subscribedTo"},
                isSubscribed:{
                    $cond:{
                        if : {$in:[req.user?._id,"$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {$project:{
            fullName:1,
            username:1,
            channelsSubscribedToCount:1,
            subscribersCount:1,
            avatar:1,
            coverImage:1,
            email:1
        }}

    ])

    if(!channel?.length){
        throw new ApiError(401,"Channel doesnt exists")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,channel[0],"user channel fetched sucessfully"))
})

//watch history
const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export { changeCurrentPassword, getChannelProfile, getCurrentUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateCoverImage, updateUserAvatar };
