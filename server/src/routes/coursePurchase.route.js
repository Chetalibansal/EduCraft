import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchaseCourse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();


router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router
  .route("/course/:courseId/details-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);
router
   .route("/")
   .get(isAuthenticated, getAllPurchaseCourse);

export default router;
