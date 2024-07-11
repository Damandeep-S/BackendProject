import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Both name and description is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });
  if (!playlist) {
    throw new ApiError(400, "Error while creating playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "UserId is required");
  }

  const playlists = await Playlist.find({ owner: userId });

  if (!playlists) {
    throw new ApiError(400, "No playlist found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Playlist does not exists");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Error while fetching playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Playlist Details Fetched Successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "No such video exists");
  }

  //   const playlist = await Playlist.findById(playlistId);
  //   if (!playlist) {
  //     return res.status(404).json({ message: "Playlist not found" });
  //   }

  //   if (playlist.videos.includes(videoId)) {
  //     return res
  //       .status(400)
  //       .json({ message: "Video already exists in the playlist" });
  //   }

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, videos: { $ne: videoId } },
    { $push: { videos: videoId } },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(
      404,
      "Playlist not found or Video already exists in the playlist"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
};
