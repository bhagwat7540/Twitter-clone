const express = require("express");
const router = express.Router();
const Post = require("../../models/post");
const { isLoggedIn } = require("../../middleware");
const User = require("../../models/user");

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

router.patch("/api/posts/:id/like", isLoggedIn, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const isLiked = req.user.likes && req.user.likes.includes(postId);

  const option = isLiked ? "$pull" : "$addToSet";

  req.user = await User.findByIdAndUpdate(
    userId,
    {
      [option]: { likes: postId },
    },
    { new: true }
  );

  const post = await Post.findOneAndUpdate(
    postId,
    {
      [option]: { likes: userId },
    },
    { new: true }
  );

  res.status(200).json(post);
});

module.exports = router;
