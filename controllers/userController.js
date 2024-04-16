const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

//middleware
const requireSingIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

/// register
const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, location, profession } = req.body;
    // validation
    if (!firstName || !lastName || !email || !password || !location || !profession) {
      return res.status(400).send({
        success: false,
        message: "Please provide all required fields: firstName, lastName, email, password, location, profession",
      });
    }

    // existing user check
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists with this email address",
      });
    }

    // hashed password
    const hashedPassword = await hashPassword(password);

    // save user
    const user = await userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      location,
      profession,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email Or Password",
      });
    }
    // find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found",
      });
    }
    //match password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid usrname or password",
      });
    }
    //TOKEN JWT
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // undeinfed password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login api",
      error,
    });
  }
};

// update user
const updateUserController = async (req, res) => {
  try {
    const { firstName, lastName, password, email, location, profession } = req.body;
    // user find
    const user = await userModel.findOne({ email });
    // password validate
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    // updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        password: hashedPassword || user.password,
        location: location || user.location,
        profession: profession || user.profession,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated successfully. Please login.",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in User Update API",
      error,
    });
  }
};

module.exports = {
  requireSingIn,
  registerController,
  loginController,
  updateUserController,
};
