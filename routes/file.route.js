const router = require('express').Router();
const { uploadProfileImage } = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const passport = require('passport');

router.use(passport.authenticate('jwt', { session: false }));

router.post('/profile', upload.single('profileImage'), uploadProfileImage);

module.exports = router;
