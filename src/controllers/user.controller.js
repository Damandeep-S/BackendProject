import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser=asyncHandler( async(req, res)=>{
    //steps to be followed
    //Get user details from the frontend
    //Validation- not empty
    //check if user is already register - username,email
    //check for images, check for avatar
    // Upload them to cloudinary
    //create user object- create entry in db
    //Remove password and refresh token field from the response
    //check for user creation
    //return res


    const {username,email,fullName,password}= req.body

    if ([fullName,email,username,password].some((field)=>
        field?.trim()===""
    )) {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser=await User.findOne({
        $or: [ { username },{ email } ]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    //It will give error cannot read properties, when we did not give cover image

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }



    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    //Now if everything is good then we make a object and send it to db

    const newUser=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser= await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering User")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )

} )

export {registerUser}