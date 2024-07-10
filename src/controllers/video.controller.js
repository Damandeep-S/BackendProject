import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const videoExists = await Video.findOne({ title });
  if (videoExists) {
    throw new ApiError(409, "Video title already exists");
  }

  let videoLocalPath;
  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.videoFile) &&
    req.files.videoFile.length > 0
  ) {
    videoLocalPath = req.files.videoFile[0].path;
  }

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail[0].path;
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  const videoExt = path.extname(videoLocalPath);
  if (!(videoExt === ".mp4")) {
    throw new ApiError(400, "Only video file is accepted");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(400, "Video is required");
  }
  if (!thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoDetails = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile?.duration,
  });

  if (!videoDetails) {
    throw new ApiError(500, "Something went wrong while Uploading");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, videoDetails, "Video Uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId).select("videoFile");

  if (!video) {
    throw new ApiError(400, "Video not found with this id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video link fetched Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId?.trim()) {
    throw new ApiError(404, "Video Id is required");
  }

  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  if ([title, description].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Title and Description is required");
  }

  const thumbnailLocalPath = req.file?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(
      500,
      "There was Problem while uploading Thumbnail on cloud"
    );
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedVideo) {
    throw new ApiError(500, "Video was not Updated Due to some error");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video was updated successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }
  // const currentVideo = await Video.findById(videoId);

  // if(!currentVideo){
  //   throw new ApiError(404,"Video does not exists")
  // }

  // const updatedVideo = await Video.findByIdAndUpdate(
  //   videoId,
  //   {
  //     $set: {
  //       isPublished: !currentVideo.isPublished,
  //     },
  //   },
  //   {
  //     new: true,
  //   }
  // );

  const updatedVideo = await Video.findOneAndUpdate(
    { _id: videoId },
    [
      {
        $set: {
          isPublished: { $not: "$isPublished" }
        }
      }
    ],
    { new: true, runValidators: true }
  );

  if (!updatedVideo) {
    throw new ApiError(400, "Video status was not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video status updated"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

export {
  publishAVideo,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
};
