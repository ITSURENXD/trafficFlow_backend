const User = require('../models/user.model');

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

module.exports = { uploadProfileImage };
