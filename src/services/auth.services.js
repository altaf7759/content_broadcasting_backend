import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import { User } from "../models/user.model.js";
import { ROLES } from "../constants/enums.js";
import { signToken } from "../utils/jwt.js";

export async function registerUser({ name, email, password, role }) {
      if (!name || !email || !password || !role) {
            throw new AppError("Name, email, password, and role are required", 400);
      }

      const normalizedRole = role.toLowerCase();
      const validRoles = [ROLES.PRINCIPAL, ROLES.TEACHER];
      if (!validRoles.includes(normalizedRole)) {
            throw new AppError(`Invalid role. Allowed: ${validRoles.join(", ")}`, 400);
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
            throw new AppError("Email is already registered", 400);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      return await User.create(name, email, hashedPassword, normalizedRole);
}

export async function loginUser({ email, password }) {
      if (!email || !password) {
            throw new AppError("Please provide both email and password", 400);
      }

      const user = await User.findByEmail(email);
      if (!user) {
            throw new AppError("Invalid email or password", 401);
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
            throw new AppError("Invalid email or password", 401);
      }

      const token = signToken({
            id: user.id,
            name: user.name,
            role: user.role
      });

      // 5. Cleanup Sensitive Data
      const safeUser = { ...user };
      delete safeUser.password_hash;

      return { user: safeUser, token };
}
