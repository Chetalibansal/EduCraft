import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.route("/upload-video").post(
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const result = await uploadMedia(req.file.path);
    if (!result) {
      return res.status(500).json({ message: "Failed to upload video" });
    }
    res.status(200).json({
      success: true,
      message: "file uploaded successfully",
      data: result,
    });
  })
);

export default router;
