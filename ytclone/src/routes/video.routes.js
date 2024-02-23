import { Router } from 'express'
import { deleteVideo, getAllVideo, getVideoById, publishVideo, togglePublishStatus } from '../controllers/video.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'





const router=Router()


//get all videos

router.route('/get-all-videos').get(verifyJWT,getAllVideo)

router.route('/publish-video').patch(
    verifyJWT,
    upload.fields([
        {
            name:"video",
            maxCount:1
        },
        {
            name:"thumbnail",
            maxCount:1
        }]
    ),
    publishVideo
)

//get video by id

router.route('/videobyid/:videoId').get(verifyJWT,getVideoById)



//delete video

router.route("/deletevideo/:videoId").delete(verifyJWT,deleteVideo)


//toggle publish status

router.route("/toggle-publish-status/:videoId").put(verifyJWT,togglePublishStatus)



export default router