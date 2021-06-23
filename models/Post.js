const mongoose = require('mongoose');

const { getConnection } = require("../helpers/databaseHelper");

const conn = getConnection();

const DRAW_DURATION = 24 * 60 * 60 * 1000;

const postSchema = new mongoose.Schema({
    //post type
    type: {
        type: String,
        enum : [ "DEBATE", "OPINION", "VOTE", "COMMENT" ],
        required: true
    },
    //parent post
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    //address of the creator
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    //amount of sats locked up for the post creation by the creator
    stake: { type: Number, required: true },
    //post title
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 180,
    },
    //contains post data
    content: {
        type: String,
        maxlength: 30000,
    },
    //extra fields
    extra: {
        type: new mongoose.Schema({
            duration: { type: Number, default: DRAW_DURATION },
        })
    }
},
{
    timestamps: true
});

module.exports = conn.model('Post', postSchema);