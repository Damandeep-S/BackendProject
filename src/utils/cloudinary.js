 import {v2 as cloudinary} from 'cloudinary'
 import fs from 'fs'

 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary=async (localfilePath)=>{
    try {
        if (!localfilePath) {
            return null
        }
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localfilePath,{
            resource_type:"auto"
        })
        //file has been uploaded
        console.log("file is uploaded",response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localfilePath)   //remove the local saved temp file on the server
        return null;
    }
}

export {uploadOnCloudinary}