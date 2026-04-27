import {
      processApproval,
      fetchAllContent,
      fetchPendingContent
} from "../services/approval.services.js";

export async function handleDecision(req, res, next) {
      try {
            const { content_id } = req.params;
            const { status, rejection_reason } = req.body;

            const result = await processApproval(content_id, req.user.id, {
                  status,
                  rejectionReason: rejection_reason
            });

            res.status(200).json({
                  success: true,
                  message: `Content has been ${result.status}`,
                  data: {
                        id: result.id,
                        status: result.status,
                        rejection_reason: result.rejection_reason
                  }
            });
      } catch (error) {
            next(error);
      }
}

export async function getAllContent(req, res, next) {
      try {
            const content = await fetchAllContent();
            res.status(200).json({
                  success: true,
                  count: content.length,
                  data: content
            });
      } catch (error) {
            next(error);
      }
}

export async function getPendingContent(req, res, next) {
      try {
            const pendingContent = await fetchPendingContent();
            res.status(200).json({
                  success: true,
                  count: pendingContent.length,
                  data: pendingContent
            });
      } catch (error) {
            next(error);
      }
}
