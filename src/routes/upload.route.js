import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";
import { requireAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    format: async (req, file) => "png", // Format (jpeg, png, etc.)
    public_id: (req, file) => file.originalname.split(".")[0], // Name the file
  },
});

const upload = multer({ storage });

// Route to handle image upload
import Upload from "../models/upload.model.js";

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { user, location, imageUrl, address } = req.body;

    if (!user) {
      return res.status(400).json({ message: "User ID is required." });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is required." });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required." });
    }

    const newUpload = new Upload({
      user,
      imageUrl,
      location,
      address,
    });

    await newUpload.save();

    res.json({ message: "Image uploaded successfully", data: newUpload });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find();
    res.json({ message: "Uploads fetched successfully", data: uploads });
    // return data;
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch uploads", error: error.message });
  }
});

export default router;
