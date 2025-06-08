const generateToken = require("../lib/generateToken");
const sentOtpEmail = require("../lib/otpMailer");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let checkUser = await userModel.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    const newUser = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    generateToken(email, res);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("error in signup", error);
    return res.status(500).json({
      success: false,
      message: "error in signup",
    });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    let checkUser = await userModel.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, checkUser.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    generateToken(email, res);

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: checkUser,
    });
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).json({
      success: false,
      message: "error in login",
    });
  }
};

exports.checkEmailAndSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await userModel.findOne({ email });

    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let otp = "";
    for (let i = 0; i < 4; i++) {
      otp += Math.floor(Math.random() * 10);
    }

    checkUser.otp = otp;
    checkUser.otpTimer = Date.now() + 5 * 60 * 1000;

    await checkUser.save();

    await sentOtpEmail(checkUser.email, otp, checkUser.username);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("error in checkMailAndSendOTP", error);
    return res.status(500).json({
      success: false,
      message: "error in checkMailAndSendOTP",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    if (Number(user.otp) !== Number(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otpTimer < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log("error in verifyOTP", error);
    return res.status(500).json({
      success: false,
      message: "error in verifyOTP",
    });
  }
};

exports.forgotPass = async (req, res) => {
  try {
    const { newPass, email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpTimer = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("error in forgotPass", error);
    return res.status(500).json({
      success: false,
      message: "error in forgotPass",
    });
  }
};

exports.checkAuth = async (req, res) => {
  res.json({ message: "User is authenticated", user: req.user });
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      success: false,
      message: "error in logout",
    });
  }
};
