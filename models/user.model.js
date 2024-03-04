const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'User name cannot be empty'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Valid email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      lowercase: true,
    },
    password: {
      type: String,
      minLength: [6, 'Password is too short- should be 6 characters minimum'],
      max: [12, 'Password length cannot be more than 12 character'],
    },
    profileImageUrl: {
      // it's optional while creating an image
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// hashing password before saving to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    // hash password
    this.password = await bcrypt.hash(this.password, 12); //12 is  the salt for hashing the password
  }

  return next();
});

// compares the validity of the password
userSchema.methods.isValidPassword = async function (candidatePassword) {
  if (!this.password) return false;

  return await bcrypt.compare(candidatePassword, this.password); //returns true and false based on the compare method
};

module.exports = mongoose.model('User', userSchema);
