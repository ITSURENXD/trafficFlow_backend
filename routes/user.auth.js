const { login, signUp } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/login', login);
router.post('/signup', signUp);
// router.post('/forgot');
// router.post('/reset');

module.exports = router;
