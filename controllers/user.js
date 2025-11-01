const User = require("../models/user.js");


// RENDER SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};


// SIGNUP LOGIC
module.exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    req.flash("error", "All fields are required!");
    return res.redirect("/signup");
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or email already exists! Please log in instead.");
      return res.redirect("/login");
    }

    // Register new user (passport-local-mongoose handles hashing)
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Log the user in after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      const redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      return res.redirect(redirectUrl);
    });
  } catch (err) {
    console.error("Signup error:", err);
    req.flash("error", err.message || "Something went wrong during signup.");
    res.redirect("/signup");
  }
};


// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// LOGIN LOGIC
module.exports.login = async (req, res) => {
  try {
    if (!req.user) {
      req.flash("error", "Invalid username or password!");
      return res.redirect("/login");
    }

    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "Something went wrong during login. Please try again.");
    res.redirect("/login");
  }
};

// LOGOUT LOGIC
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};
