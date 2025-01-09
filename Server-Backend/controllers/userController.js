import User from "../models/userModel.js";

//Getting User Data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      userData: { name: user.name, verifiedStatus: user.isAccountVerified },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
