import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";
import { ROLES } from "../constants/enums.js";

export const protect = async (req, res, next) => {
      try {
            let token;

            if (req.cookies && req.cookies.jwt) {
                  token = req.cookies.jwt;
            }
            else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                  token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                  throw new AppError("You are not logged in. Please provide a token.", 401);
            }

            const decoded = verifyToken(token);
            req.user = decoded;

            next();
      } catch (error) {
            next(error);
      }
};

export const authorize = (...allowedRoles) => {
      return (req, res, next) => {
            try {
                  if (!req.user) {
                        throw new AppError("User not authenticated", 401);
                  }

                  if (!allowedRoles.includes(req.user.role)) {
                        throw new AppError(
                              `Access denied. Required role: ${allowedRoles.join(" or ")}`,
                              403
                        );
                  }

                  next();
            } catch (error) {
                  next(error);
            }
      };
};
