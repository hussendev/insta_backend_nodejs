const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

//TODO: VAILDATE THE USER INPUTS .  


const cookiesExpireTime = 24 * 60 * 60 * 1000;
const firebaseInit = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID
})

const tokenGenrator = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}


// @des    login
// @route  GET /api/auth/login
// @access public
const login = asyncHandler(
  async (req, res) => {
    console.log(req.body);
    
    // destruct the eamil , password , googleToken 
    // create the variables : user verified 
    const { email, password, googleToken } = req.body;
    let user = null;
    let verified = false;

    if (googleToken) {
      const decoded = await getAuth().verifyIdToken(googleToken);
      user = await User.findOne({ email: decoded.email });
      verified = true && user;
    } else if (email && password) {
      user = await User.findOne({ email });
      verified = await bcrypt.compare(password, user.password);
      console.log(verified);
      
    } else {
      res.status(400);
      throw new Error('Add Credentials , pls ');
    }

    if (verified) {
      res
        .cookie('token', tokenGenrator(user._id), { httpOnly: true, expire: new Date() + cookiesExpireTime })
        .status(200)
        .json({
          status: true,
          message: 'login successful' ,
          data: {
            _id: user._id,
            eamil: user.email,
            username: user.username
          }
        })
    }else{
      res.status(400);
      throw new Error(
        'Invalid Credentials'
      );

    }
  }
)



// @des    register 
// @route  POST /api/auth/register
// @access public
const register = asyncHandler(async (req, res) => {
  const { username, email, password, googleToken } = req.body;
  let userToReturn = null;
  let userExists = null;
  let verified = false;

  // Add validation for email field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  // Add validation for password field
  const passwordRegex = /^(?=.*[0-9])(?=.*[.]).{6,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    if (!/(?=.*[0-9])/.test(password)) {
      throw new Error('Password must contain at least one digit');
    }
    if (!/(?=.*[.])/.test(password)) {
      throw new Error('Password must contain at least one "."');
    }
    if (!/.{6,}$/.test(password)) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  if (googleToken) {
    let decoded = await getAuth().verifyIdToken(googleToken);
    userExists = await User.findOne({ email: decoded.email });
    userToReturn = !userExists && await User.create({
      email: decoded.email,
      username: decoded.name,
    });
    verified = true && !userExists;

  } else if (username && email && password) {
    userExists = await User.findOne({ email: email });
    userToReturn = !userExists && await User.create({
      email,
      username,
      password: await bcrypt.hash(password, 12)
    });
    verified = true && !userExists;

  } else {
    res.status(400);
    throw new Error('Add credentials, please');
  }

  if (verified) {
    res
      .cookie('token', tokenGenrator(userToReturn._id), { httpOnly: true, expire: new Date() + cookiesExpireTime })
      .status(200)
      .json({
        status: true,
        message: 'Register Successful',
        data: {
          _id: userToReturn._id,
          email: userToReturn.email,
          username: userToReturn.username,
        }
      });
  } else {
    res.status(400);
    throw new Error('The User Already exists');
  }
});



// @des    logout
// @route  get /api/auth/logout
// @access public
const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie('token')
    .status(200)
    .json({
      status: true,
      message: 'logout successful',
    })
})

// @des    register 
// @route  get /api/auth/isauth
// @access public
const isAuth = (req, res) => {
  res.status(200).json(req.user)
}

module.exports = { login, register, logout, isAuth }