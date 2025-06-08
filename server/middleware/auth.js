const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("token not found");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    const user = await userModel
      .findOne({ email: decode.email })
      .select("-password");

    // console.log("decode", decode);
    // console.log("user", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized User",
    });
  }
};
