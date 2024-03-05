const User = require('../models/user.model');
const fs = require('fs');

// upload the profile image based on the authenticated user
const uploadProfileImage = async (req, res) => {
  try {
    // validate file presence
    if (!req.file) {
      return res
        .status(400)
        .json({ msg: 'profile image cannot be uploaded', success: true });
    }

    // update the user document
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        profileImageUrl: req.file.path,
      },
      { new: true, runValidators: true } //return updated document and run schema validations
    ).select('-password'); //exclude the password field

    // check if the user found and updated
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found', success: true });
    }

    // respond with the success message
    res.status(200).json({ msg: 'File upload successful', success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', success: false });
  }
};

//get the profile image based on the user request
const getProfileImage = async (req, res) => {
  try {
    const userId = req.user._id; //query the user id to find the url of the profile

    const user = await User.findById({ _id: userId }).select('-password');

    if (!user) {
      return res.status(400).json({
        msg: 'User not found',
        success: false,
      });
    }

    try {
      const imageType = user.profileImageUrl.split('.').pop();

      fs.readFile(`${user.profileImageUrl}`, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error retrieving image');
        }

        // Set the appropriate content type based on the image format
        res.setHeader('Content-Type', `image/${imageType}`); // Adjust for other formats like PNG, etc.
        res.send(data);
      });
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "The profile image doesn't exist", success: false });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', success: false });
  }
};

module.exports = { uploadProfileImage, getProfileImage };
