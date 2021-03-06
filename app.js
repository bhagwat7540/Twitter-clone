const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");

const { isLoggedIn } = require("./middleware");

const User = require("./models/user");

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/twitter-clone")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//API
const postsApiRoute = require("./routes/api/posts");

//ROUTES
const authRoutes = require("./routes/authRoutes");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//using routes
app.use(authRoutes);

//Using api
app.use(postsApiRoute);

app.get("/", isLoggedIn, (req, res) => {
  res.render("home.ejs");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
