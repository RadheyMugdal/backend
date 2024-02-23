import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

//toggle video like
router.route('/toggle-video-like/:videoId').post(verifyJWT,toggleVideoLike)


//toggle comment like 
router.route('/toggle-comment-like/:commentId').post(verifyJWT,toggleCommentLike)


//get liked videos 
router.route('/get-liked-videos').get(verifyJWT,getLikedVideos)

export default router