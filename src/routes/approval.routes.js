import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { ROLES } from "../constants/enums.js";
import {
      handleDecision,
      getAllContent,
      getPendingContent
} from "../controllers/approval.controller.js";

export const approvalRouter = express.Router();

approvalRouter.use(protect, authorize(ROLES.PRINCIPAL));

approvalRouter.patch("/:content_id", handleDecision);
approvalRouter.get("/all", getAllContent);
approvalRouter.get("/pending", getPendingContent);