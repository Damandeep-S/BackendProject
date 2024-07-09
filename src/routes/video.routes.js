import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publishAVideo } from "../controllers/video.controller.js";

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

router.route("/:videoId").get(getVideoById)

export default router