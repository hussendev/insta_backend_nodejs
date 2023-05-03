const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protected = asyncHandler(
  async (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      res.status(401);
      throw new Error('unauthorized');
      
    }
  
    try {
      const { id } = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ _id: id }).select('_id username email');
      next();
    } catch (err) {
      res
        .clearCookie('token')
        .status(401);
      throw new Error('unauthorized');
    }
  }
)
module.exports = protected