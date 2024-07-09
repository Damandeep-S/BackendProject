import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(
    upload.fields([
        {
          name: "videoFile",
          maxCount: 1,
        },
        {
          name: "thumbnail",
          maxCount: 1,
        },
      ]),
      publishAVideo
)

router.route("/:videoId").get(getVideoById).delete(deleteVideo)

router.route("/:videoId").patch(upload.single("thumbnail"),updateVideo)

export default router