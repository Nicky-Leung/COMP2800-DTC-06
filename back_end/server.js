// Please put routes in routes file instead of server.js so that the code is more organized and easier to read.
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
var session = require('express-session');
var mongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

app.set('view engine', 'ejs')

// MongoDB connection
var store = new mongoDBStore({
  uri: `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9kdinuu.mongodb.net/connect_mongodb_session_test?retryWrites=true&w=majority`,
  collection: 'mySessions'
});

async function main() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9kdinuu.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`);
    console.log('Connected to MongoDB');
  }
  catch (err) {
    console.log(err);
  }
}

main().catch(err => console.log(err));

const usersModel = require('./models/userModel');
const matchModel = require('./models/matchModel');

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 },
  store: store,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Middleware to check if user is logged in 
isUserAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    req.currentUser = req.session.currentUser;
    next()
  }
  else
    res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' })
};


// Public Routes
app.get('/', (req, res) => {
  res.render('home.ejs', { passwordUpdated: req.query.passwordUpdated })
})
app.get('/home', (req, res) => {
  res.render('welcomepage.ejs')
});

const login = require('./routes/login');
const placeSearch = require('./routes/placeSearch');
const indexscript = require('./routes/indexscript');
const leaderboard = require('./routes/leaderboard');
const information = require('./routes/information');
const addFriends = require('./routes/addFriends')
const resetPassword = require('./routes/resetPassword');
const resetPasswordWithEmail = require('./routes/resetPasswordWithEmail');
const profile = require('./routes/profile');
const otherProfile = require('./routes/otherProfile');
const map = require('./routes/map');
const lobby = require('./routes/lobby');
const matchSessions = require('./routes/matchSessions');
const searchFriends = require('./routes/searchFriends')
const createMatch = require('./routes/createMatch');
const updateProfile = require('./routes/updateProfile');
const settings = require('./routes/settings');

app.use(login);
app.use(information);
app.use(resetPasswordWithEmail);
app.use(isUserAuthenticated);

// Protected Routes (User must be logged in)
app.use(indexscript);
app.use(placeSearch);
app.use(resetPassword);
app.use(settings);
app.use(addFriends)
app.use(profile);
app.use(otherProfile);
app.use(map);
app.use(updateProfile);
app.use(createMatch);
app.use(searchFriends)
app.use(matchSessions);
app.use(lobby);


app.get('/index', (req, res) => {
  res.render('index')
}
);
app.get('/localleaderboard', leaderboard);
app.get('/regionalleaderboard', leaderboard);
app.get('/globalleaderboard', leaderboard);
app.get('/match', (req, res) => {
  res.render('match.ejs')
});
app.get('/matchend', (req, res) => {
  res.render('matchover.ejs')
});

app.get('/logout', isUserAuthenticated, function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});
app.get('/editProfile', isUserAuthenticated, (req, res) => {
  res.render('editProfile.ejs', { name: req.session.name, email: req.session.email, type: req.session.type, bio: req.session.bio, profilePicture: req.session.profilePicture })
});

app.listen(3000, () => {
  console.log(`Server running on port 3000!`)
})  