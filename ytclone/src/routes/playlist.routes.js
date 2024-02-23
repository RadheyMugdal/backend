import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, getAllPlaylistVideos, getPlaylistById, getUserPlaylist, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

//create playlist 

router.route('/create-playlist').post(verifyJWT,createPlaylist)

//get user playlist

router.route('get-user-playlist/:userId').get(verifyJWT,getUserPlaylist)

//get playlist by id 

router.route('get-playlistbyid/:playlist:Id').get(verifyJWT,getPlaylistById)

//add video to playlist

router.route('add-videotoplaylist/:playlistId/:videoId').post(verifyJWT,addVideoToPlaylist)

//remove video from playlist 

router.route('/remove-videofromplaylist/:videoId/:playlistId').delete(verifyJWT,removeVideoFromPlaylist)

//get videos from playlist 
router.route('/getvideosofplaylist').get(verifyJWT,getAllPlaylistVideos)


export default router