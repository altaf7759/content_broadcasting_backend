export function GlobalErrorHandler(err, req, res, next) {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`[ERROR] ${message}`);

      res.status(statusCode).json({
            success: false,
            message: err.isOperational ? message : "Something went wrong on our end."
      });
};