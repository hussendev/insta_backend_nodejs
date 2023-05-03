const { Router } = require('express')
const protected = require('../middleware/authMiddleware');
const router = Router();
const { login, register, logout, isAuth } = require('../controllers/authController');

router
  .post('/login', login)
  .post('/register', register)
  .get('/logout', logout)
  .get('/isauth', protected, isAuth)


module.exports = router;