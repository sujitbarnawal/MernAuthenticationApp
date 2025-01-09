import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

//Register your account
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Please fill in all fields." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      password: hashedPassword,
      email: email,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //send email for registering
    const mailOptions = {
      from: process.env.SENDER_EMAIL_ID,
      to: email,
      subject: "Welcome!",
      text: `Welcome to my mernAuthentication.Your account has been created successfully
       with email id: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Registered successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Login your account
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Please fill in all fields." });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Logout your account
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Verification OTP to the user
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "User is already verified" });
    }
    const otp = String(Math.floor(Math.random() * 900000) + 100000);
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL_ID,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp} and it will expire in 24 hours`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Verify your account using OTP
export const verifyAccount = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: error.message });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL_ID,
      to: user.email,
      subject: "Account Verification",
      text: `Your account is verified successfully`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Your email is verified" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Send Password reset otp
export const sendPassResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      const newOtp = String(Math.floor(Math.random() * 900000 + 100000));
      user.resetOtp = newOtp;
      user.resetOtpExpireAt = Date.now() * 10 * 60 * 1000; // 10 minutes
      await user.save();
      const mailOptions = {
        from: process.env.SENDER_EMAIL_ID,
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your password reset OTP is ${newOtp} and it will expire in 10 minutes`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",newOtp).replace("{{email}}",user.email)
      };
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "Password reset OTP sent" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//Reset password
export const resetPass = async (req, res) => {
  const { email, otp, newPass } = req.body;
  if (!email ) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }
  if (!otp ) {
    return res.json({
      success: false,
      message: "Otp is required",
    });
  }
  if (!newPass ) {
    return res.json({
      success: false,
      message: "New Password is required",
    });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp !== otp || user.resetOtp === "") {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }
    const hashedNewPass = await bcrypt.hash(newPass, 12);
    user.password = hashedNewPass;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL_ID,
      to: user.email,
      subject: "Password Reset Success",
      text: `Your password has been reset successfully`,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
