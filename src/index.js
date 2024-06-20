import connectDB from "./db/index.js";
import 'dotenv/config'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!!",err);
})