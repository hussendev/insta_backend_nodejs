const { Router } = require('express')
const Post = require('../models/postModel');
const { createPost, getPosts, getPosyByDay,getPostByMonth, deletePost, updatePost } = require('../controllers/postController');
const protected = require('../middleware/authMiddleware')
const router = Router();

router
  .post('/create-post', protected, createPost)

  .get('/get-posts', protected, getPosts)

  .get('/get-posts-by-day', protected, getPosyByDay)

  .get('/get-posts-by-month', protected, getPostByMonth)

  .delete('/delete-post/:id', protected, deletePost)

  .put('/update-post/:id', protected, updatePost)






module.exports = router;