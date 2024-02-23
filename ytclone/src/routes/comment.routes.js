import { Router } from "express";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router =Router()


//add comment

router.route('/add-comment/:videoId').post(verifyJWT,addComment)

//delete comment
router.route('/delete-comment/:commentId').delete(verifyJWT,deleteComment)

//update comment
router.route('/update-comment/:commentId').patch(verifyJWT,updateComment)


export default router