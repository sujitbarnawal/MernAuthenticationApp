import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPass,
  sendPassResetOtp,
  sendVerifyOtp,
  verifyAccount,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verification-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyAccount);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-pass-reset-otp",userAuth, sendPassResetOtp);
authRouter.post("/reset-password",userAuth, resetPass);

export default authRouter;
