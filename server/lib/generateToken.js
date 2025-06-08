const jwt = require("jsonwebtoken");

module.exports = async (email, res) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // only over HTTPS
      sameSite: "None", // because frontend and backend are on different domains
    });
  } catch (error) {
    console.log("error in generateToken : ", error);
  }
};
