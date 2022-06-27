const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

//To get signup form
router.get("/register", (req, res) => {
  res.render("./auth/signup", { message: req.flash("error") });
});

// registering user
router.post("/register", async (req, res) => {
  try {
    const user = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
    };

    const newUser = await User.register(user, req.body.password);
    req.flash("success", "Registered Successfully,Please Login to continue");
    res.redirect("/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

//To GET the login page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//Login THE User
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

//Logout the User
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    else res.redirect("/login");
  });
});

module.exports = router;
