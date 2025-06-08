import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const productRoute = async (req, res, next) => {
  
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorised- no token provide" });
    } 

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if(!decode){
        return res.status(401).json({ message:"Unauthorised- Invalid token"})}

    const user = await User.findById(decode.userid).select("-password");

    if(!user){
       return res.status(404).json({
      message:"User not found "
    })};

    req.user = user;

    next();


  } catch (error) {
    console.log("Error in productroute middleware",error.message);
    return res.status(500).json({
      message:"Internal Server error er"
    });
  }
};
