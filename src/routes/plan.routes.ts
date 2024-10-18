import express from "express";
import {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  purchasePlan,
} from "../controllers/plan.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Route for creating a plan
router.post("/", createPlan);

// Route for getting all plans
router.get("/", getPlans);

// Route for getting a single plan by ID
router.get("/:id", getPlanById);

// Route for updating a plan by ID
router.patch("/:id", updatePlan);

// Route for deleting a plan by ID
router.delete("/:id", deletePlan);

router.post("/purchase", protect,purchasePlan)

export default router;
