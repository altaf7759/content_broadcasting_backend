import { Content } from "../models/content.model.js";
import { CONTENT_STATUS } from "../constants/enums.js";
import AppError from "../utils/appError.js";

export async function processApproval(contentId, principalId, decisionData) {
      const status = decisionData.status?.toLowerCase();
      const { rejectionReason } = decisionData;

      const content = await Content.findById(contentId);
      if (!content) throw new AppError("Content not found", 404);

      const allowedDecisions = [CONTENT_STATUS.APPROVED, CONTENT_STATUS.REJECTED];
      if (!allowedDecisions.includes(status)) {
            throw new AppError(`Invalid status. Must be one of: ${allowedDecisions.join(', ')}`, 400);
      }

      if (content.status !== CONTENT_STATUS.PENDING) {
            throw new AppError(`Action forbidden. Content is already ${content.status}`, 400);
      }

      if (status === CONTENT_STATUS.REJECTED && !rejectionReason) {
            throw new AppError("A rejection reason must be provided", 400);
      }

      const updatedContent = await Content.updateStatus(contentId, {
            status,
            rejectionReason: status === CONTENT_STATUS.REJECTED ? rejectionReason : null,
            approvedBy: principalId,
            approvedAt: status === CONTENT_STATUS.APPROVED ? new Date() : null
      });

      return updatedContent;
}

export async function fetchAllContent() {
      return await Content.findAll();
}

export async function fetchPendingContent() {
      return await Content.findByStatus(CONTENT_STATUS.PENDING);
}