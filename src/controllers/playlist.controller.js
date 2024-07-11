import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
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

export { createPlaylist, getUserPlaylists, getPlaylistById };
