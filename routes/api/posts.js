const express = require("express");
const router = express.Router();
const Post = require("../../models/post");
const { isLoggedIn } = require("../../middleware");

//To Get All the Posts
router.get("/api/post", isLoggedIn, async (req, res) => {
  const posts = await Post.find({}).populate("postedBy");

  res.json(posts);
});

// To Add a New Post
router.post("/api/post", isLoggedIn, async (req, res) => {
  // console.log(req.body);
  const post = {
    content: req.body.content,
    postedBy: req.user,
  };

  const newPost = await Post.create(post);
  res.json(newPost);
});

module.exports = router;
