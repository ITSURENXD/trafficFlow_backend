const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

/*
  user signup
*/

const signUp = async (req, res) => {
  try {
    const { username, email } = req.body; //password not labeled for security reason

    // search user based on the email
    const existsUser = await User.findOne({ email: email.toLowerCase() });

    if (existsUser) {
      return res.status(400).json({
        message: 'User already exists with the provided email',
        success: false,
      });
    }

    // create a new user instance
    const user = new User({
      username,
      email,
      password: req.body.password,
    });

    // save the user
    await user.save();

    res
      .status(201)
      .json({ message: 'User successfully created', success: true });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating user',
      error: err.message,
      success: false,
    });
  }
};

/*
  user login
*/
const login = async (req, res) => {
  try {
    const { email } = req.body;
    const existsUser = await User.findOne({ email: email.toLowerCase() });

    if (!existsUser) {
      return res.status(400).json({
        message: 'Invalid Credentials',
        success: false,
      });
    }

    const isCorrectPassword = await existsUser.isValidPassword(
      req.body.password
    );

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: 'Invalid password',
      });
    }

    // payload containing the object id and email
    const payload = {
      id: existsUser._id,
      email: existsUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '6h',
    });

    res.status(200).json({
      _id: existsUser._id,
      success: true,
      message: 'login successful',
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  }
};

// user profile image addition to the user schema

module.exports = { login, signUp };
