import cloudinary from "../lib/Cloudinary.js";
import { generatetoken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcryt from "bcryptjs";

export const signin = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(401).json({
        message: "All the fields are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "please enter at least 6 characters",
      });
    }
    const user = await User.findOne({ email });

    if (user) return res.status(401).json({ message: "Email already exists" });

    const salt = await bcryt.genSalt(10);
    const hashed = await bcryt.hash(password, salt);

    const newuser = new User({
      email,
      fullName,
      password: hashed,
    });
    if (newuser) {
      generatetoken(newuser._id, res);
      await newuser.save();

      res.status(200).json({
        _id: newuser._id,
        fullName: newuser.fullName,
        email: newuser.email,
        profilePic: newuser.profilePic,
      });
    } else {
      console.log("Invalid user data");
    }
  } catch (error) {
    console.log("Error in Signing up control", error.message);
    return res.status(500).json({
      message: "Interval Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid Credentails" });
    }

    const ispasswordcorrect = await bcryt.compare(password, user.password);
    if (!ispasswordcorrect) {
      return res.status(400).json({ message: "invalid Credentails" });
    }

    generatetoken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Login control", error.message);
    return res.status(500).json({
      message: "Interval Server Error",
    });
  }
};

//Logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout user successfully" });
  } catch (error) {
    console.log("Error in Signing up control", error.message);

    return res.status(500).json({ message: "Interval Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userid = req.user.id;
    if(!profilePic){
      return res.status(400).json({
        message:"User profilePic is required"
      })
    }
    const uploadresponce = await cloudinary.uploader.upload(profilePic);
    const uploaduser = await User.findByIdAndUpdate(userid,{profilePic:uploadresponce.secure_url},{new:true})
    res.status(200).json(uploaduser)


  } catch (error) {
    console.log("Error in updateprofile-controller");
    
    return res.status(500).json({
      message:"Internal server Error"
    })
  }
};

export const checkauth = async (req,res) =>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("error in checkauth-controller");
    return res.status(500).json({
      message:"error in server checkauth- conyroller"
    })
    
  }
}