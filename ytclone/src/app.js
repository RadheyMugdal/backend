import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration

app.use("/api/v1/users",userRouter)

// http://localhost:8000/users 

//video router 

import videoRouter from './routes/video.routes.js'

app.use('/api/v1/video',videoRouter)





//comment router 
import commentRouter from "./routes/comment.routes.js"

app.use('/api/v1/comment',commentRouter)


//like router 
import likeRouter from './routes/like.routes.js'

app.use('/api/v1/like',likeRouter)

//playlist router

import playlistRouter from './routes/playlist.routes.js'

app.use('/api/v1/playlist',playlistRouter)


//tweet controller

import tweetRouter from './routes/tweet.routes.js'

app.use('/api/v1/tweet',tweetRouter)

export default app
