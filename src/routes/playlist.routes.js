import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, getPlaylistById, getUserPlaylists,addVideoToPlaylist, removeVideoFromPlaylist } from "../controllers/playlist.controller.js";

const router=Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist)
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId")
    .get(getPlaylistById)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

export default router