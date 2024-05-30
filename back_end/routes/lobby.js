const express = require('express');
const router = express.Router();
const matchModel = require('../models/matchModel');
const userModel = require('../models/userModel');

router.get('/lobby', async (req, res) => {
    let matchID;
    // setting the matchID to the ID in the session if it is prexisting
    if (req.session.activematch) {
        matchID = await req.session.activematch;
        (console.log("session"));
    } else {
        // setting the matchID to the ID in the query if it is prexisting
        matchID = await req.query.matchID;
        console.log("query");
    }
    // setting the matchID to the ID in the session if it is prexisting or created and redirected from creatematch.
    try {
        delete req.session.activematch;
        const currentUser = await userModel.findOne({ name: req.session.currentUser.name }); 
        // get the current user
        const currentMatch = await matchModel.findOne({ _id: matchID });
        // get the current match using the matchID and mongoDB query
        console.log(currentMatch);
        homeTeamElo = 0;
        awayTeamElo = 0;
        for(let i = 0; i < currentMatch.homePlayers.length; i++){
            homeTeamElo += currentMatch.homePlayers[i].elo;
        }
        for(let i = 0; i < currentMatch.awayPlayers.length; i++){
            awayTeamElo += currentMatch.awayPlayers[i].elo;
        }
        homeTeamElo = homeTeamElo / currentMatch.homePlayers.length;
        awayTeamElo = awayTeamElo / currentMatch.awayPlayers.length;
        
        /** Render the lobby page with the information of the match and its players
         * Parts of the functionaloty generated by Github Copilot
         * 
         * 
         * @author https://github.com/features/copilot
        */
        if (currentUser && currentMatch) {
            totalPlayers = parseInt(currentMatch.matchType.charAt(0));
            // check if the total number of players is equal to the sum of the home and away players
            if ((currentMatch.homePlayers.length + currentMatch.awayPlayers.length) == totalPlayers) {
                res.render('lobby.ejs', {
                    location: currentMatch.location.name,
                    address: currentMatch.location.address,
                    homePlayers: currentMatch.homePlayers, awayPlayers: currentMatch.awayPlayers,
                    homeTeamElo: homeTeamElo, awayTeamElo: awayTeamElo,
                    matchType: currentMatch.matchType, sport: currentMatch.sport
                });
            }
            // render lobby page with the match information using ejs
            const isUserInMatch = currentMatch.homePlayers.some(player => player._id.toString() === currentUser._id.toString()) ||
                currentMatch.awayPlayers.some(player => player._id.toString() === currentUser._id.toString())
                // check if the user is in the match

            if (!isUserInMatch && currentMatch.awayPlayers.length >= currentMatch.homePlayers.length) {
                currentMatch.homePlayers.push(currentUser); 
                // add the user to the home team if the away team is fuller or full
            } else if (!isUserInMatch) {
                currentMatch.awayPlayers.push(currentUser); 
                // add the user to the away team if the home team is fuller or full
            }
        }
        currentMatch.save(); // save the current match to the mongodb database
        res.render('lobby.ejs', {
            location: currentMatch.location.name,
            address: currentMatch.location.address,
            homePlayers: currentMatch.homePlayers, awayPlayers: currentMatch.awayPlayers,
            homeTeamElo: homeTeamElo, awayTeamElo: awayTeamElo,

            matchType: currentMatch.matchType, sport: currentMatch.sport,
            matchID: currentMatch._id
        });
        // render the lobby page with the match information using ejs
    }
    catch (error) { // catch any errors
        console.error('Error during match creation:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;