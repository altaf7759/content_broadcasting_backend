import { loginUser, registerUser } from "../services/auth.services.js";

export async function register(req, res, next) {
      try {
            const user = await registerUser(req.body);

            res.status(201).json({
                  success: true,
                  message: "User created successfully",
                  user
            });
      } catch (error) {
            next(error);
      }
}

export async function login(req, res, next) {
      try {
            const { user, token } = await loginUser(req.body);

            res.cookie('jwt', token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production',
                  sameSite: 'strict',
                  maxAge: 24 * 60 * 60 * 1000 // 1 Day
            });

            res.status(200).json({
                  success: true,
                  message: "Logged in successfully",
                  user
            });
      } catch (error) {
            next(error);
      }
}
