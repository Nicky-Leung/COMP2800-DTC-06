const express = require('express');
const router = express.Router();
const usermodel = require('../models/userModel');


const isUserAuthenticated = (req, res, next) => {
    if (req.session.authenticated) {
        req.currentUser = req.session.currentUser;
        next();
    } else {
        res.status(401).render('notLoggedIn.ejs', { message: 'Please login first' });
    }
};

router.get('/profile', isUserAuthenticated, async (req, res) => {
    try {
        const user = await usermodel.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile.ejs', {
            name: req.session.name,
            email: req.session.email,
            type: req.session.type,
            bio: req.session.bio,
            profilePicture: user.profilePicture
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}
);

module.exports = router;
