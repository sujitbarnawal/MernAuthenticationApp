//This middleware will find the token from the cookie and from that
// toke it will find the userId which are used in OTP verification
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return res.json({ success: false, message: "User not authenticated.Login again" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if(decodedToken.id){
        req.body.userId = decodedToken.id
    }else{
        return res.json({ success: false, message: "User not authenticated.Login again" });
    }
    next()
  } catch (error) {
    return res.json({success:false,message:error.message})
  }
};

export default userAuth