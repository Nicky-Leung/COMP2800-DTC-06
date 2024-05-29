const mongoose = require('mongoose');

const createdMatchSchema = new mongoose.Schema({
    sport: String,
    /** 
    *  Create location object that can store coordinates and name in mongoose schema
    *  Generated by AI copilot 
    *  @author https://github.com/copilot
    */
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        address: String,
        coordinates: {
            type: [Number],
            required: true
        },
        name: String,
    },
    time: Date,
    date: Date,
    matchType: String,
    rank: String,
    elo: Number,
    score: {
        home: Number,
        away: Number
    },
    homePlayers: Array,
    awayPlayers: Array,
    timeLeft: Number,
});

// This is necessary to enable 2dsphere indexing for location
createdMatchSchema.index({ location: '2dsphere' });

const matchModel = mongoose.model('current_matches', createdMatchSchema);

module.exports = matchModel;