import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

//create tweet
router.route('/create-tweet').post(verifyJWT,createTweet)

//fetch user tweeets
router.route('/fetch-tweets').get(verifyJWT,getUserTweets)

//delete tweet
router.route('/delete-tweet/:tweetId').delete(verifyJWT,deleteTweet)

//update tweet
router.route('/update-tweet/:tweetId').patch(verifyJWT,updateTweet)

export default router