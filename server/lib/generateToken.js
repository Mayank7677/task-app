const jwt = require("jsonwebtoken");

module.exports = async (email, res) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.cookie("token", token);
  } catch (error) {
    console.log("error in generateToken : ", error);
  }
};
