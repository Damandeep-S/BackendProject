import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors()) // Enabling CORS makes it possible for your app to interact with servers located on different domains.
app.use(express.json({limit:"16kb"}))  //This line tells the app to use JSON (JavaScript Object Notation) parser middleware, which helps the app understand and work with JSON data sent in requests. The limit: "16kb" part restricts the size of the JSON data it will accept to 16 kilobytes. 
app.use(express.urlencoded({extended:true})) //This line enables the app to parse URL-encoded data (like the data submitted in an HTML form). The {extended: true} option allows the app to handle complex data structures (nested objects) in the URL-encoded data.
app.use(express.static('public'))  //example, if there's an image in the public folder, it can be accessed via the URL http://yourapp.com/image.png.

app.use(cookieParser())

export {app}