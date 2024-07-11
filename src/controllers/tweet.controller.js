import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const user = req.user?._id;

  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  const newTweet = await Tweet.create({
    content,
    owner: user,
  });

  if (!newTweet) {
    throw new ApiError(400, "Tweet could not be posted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, "Tweet posted successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User not found");
  }

  const tweets = await Tweet.find({ owner: userId });

  if (!tweets) {
    throw new ApiError(400, "Error occurred while fetching tweets");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "Tweet Id is required");
  }
  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: { content: content },
    },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(400, "Tweet does not exists");
  }

  return res.status(200)
  .json(new ApiResponse(200,tweet,"Tweet content updated"))
});


const deleteTweet= asyncHandler(async (req, res) => {
    const {tweetId}=req.params

    if(!tweetId?.trim()){
        throw new ApiError(404,"TweetId is required")
    }

    const tweet=await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(400,"Tweet does not exists")
    }

    return res.status(200)
    .json(new ApiResponse(200,{},"Tweet deleted successfully"))
});

export { createTweet, getUserTweets,updateTweet ,deleteTweet};
