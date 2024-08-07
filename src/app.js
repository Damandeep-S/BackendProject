import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors()) // Enabling CORS makes it possible for your app to interact with servers located on different domains.
app.use(express.json({limit:"16kb"}))  //This line tells the app to use JSON (JavaScript Object Notation) parser middleware, which helps the app understand and work with JSON data sent in requests. The limit: "16kb" part restricts the size of the JSON data it will accept to 16 kilobytes. 
app.use(express.urlencoded({extended:true})) //This line enables the app to parse URL-encoded data (like the data submitted in an HTML form). The {extended: true} option allows the app to handle complex data structures (nested objects) in the URL-encoded data.
app.use(express.static('public'))  //example, if there's an image in the public folder, it can be accessed via the URL http://yourapp.com/image.png.

app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export {app}