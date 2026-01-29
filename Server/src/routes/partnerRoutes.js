// Partner routes - URL endpoints for partner operations
import express from "express";
import { partnerController } from "../controllers/partnerController.js";
import { upload, handleMulterError } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  console.log("✅ Partner routes test endpoint hit!");
  res.json({ message: "Partner routes are working!" });
});

// POST /api/partners/login - partner authentication
router.post("/login", partnerController.login);

// POST /api/partners/signup - now with database integration
router.post("/signup", partnerController.signup);

// GET /api/partners/properties - get partner properties
router.get("/properties", partnerController.getProperties);

// PUT /api/partners/properties - update partner accommodation
router.put("/properties", partnerController.updateAccommodation);

// GET /api/partners/stores - get partner stores
router.get("/stores", partnerController.getStores);

// PUT /api/partners/stores - update partner service
router.put("/stores", partnerController.updateService);

// GET /api/partners/all-accommodations - get all accommodations public
router.get("/all-accommodations", partnerController.getAllAccommodations);

// POST method forget password in otp generator
router.post("/send-otp", partnerController.sendOtp);

// POST method verify-password in to otp check
router.post("/verify-otp", partnerController.verifyOtp);

// POST method reset-password
router.post("/reset-password", partnerController.resetPassword);

// POST /api/partners/upload-image - upload property image
router.post("/upload-image", upload.single('image'), handleMulterError, partnerController.uploadPropertyImage);

// PUT /api/partners/properties/photos - save photos to database
router.put("/properties/photos", partnerController.updatePhotos);

// PUT /api/partners/properties/rules - save rules to database
router.put("/properties/rules", partnerController.updateRules);

console.log("🚀 Partner routes loaded successfully");

export default router;
