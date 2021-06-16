const mongoose = require('mongoose');

const { getConnection } = require("../helpers/databaseHelper");

const conn = getConnection();

const postSchema = new mongoose.Schema({
    //address of the creator
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    //post title
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 180,
    },
    //description of the post
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 30000,
    },
    //post type
    type: {
        type: String,
        enum : [ "DEBATE","OPINION", "COMMENT" ],
        required: true
    },
},
{
    timestamps: true
});

module.exports = conn.model('Post', postSchema);