const router = require('express').Router();
const {
  uploadProfileImage,
  getProfileImage,
} = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const passport = require('passport');

// authenticated route
router.use(passport.authenticate('jwt', { session: false }));

router
  .route('/profile')
  .post(upload.single('profileImage'), uploadProfileImage)
  .get(getProfileImage);

module.exports = router;
