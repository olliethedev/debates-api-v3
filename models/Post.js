const mongoose = require('mongoose');

const { getConnection } = require("../helpers/databaseHelper");

const conn = getConnection();

const DRAW_DURATION = 24 * 60 * 60 * 1000;

const postSchema = new mongoose.Schema({
    //post type
    type: {
        type: String,
        enum : [ "DEBATE", "VOTE", "COMMENT" ],
        required: true
    },
    //parent post
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        validate: function(v) {
            return this.type !== "DEBATE";
        },
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
            //Debate specific
            //duration of the debate from createdAt time
            duration: { 
                type: Number,
                required: function() {
                    return this.parent().type === "DEBATE"
                }
            },
            //possible outcomes for the debate
            possibleOutcomes: {
                type: [new mongoose.Schema({
                    name: { type: String, required: true},
                })],
                required: function() {
                    return this.parent().type === "DEBATE"
                },
                validate: function(v) { 
                    return this.parent().type !== "DEBATE" || Array.isArray(v) && v.length > 0
                },
            },
            //maximum number of winning outcomes for the event
            possibleWinners: { 
                type: Number,
                min: 1,
                required: function() {
                    return this.parent().type === "DEBATE"
                }
            },
            //Vote specific
            //which outcome this vote is for
            forOutcome: { 
                type: mongoose.Schema.Types.ObjectId,
                required: function() {
                    return this.parent().type === "VOTE"
                },
                validate: function(val) {
                    //todo check this.parent().parent contains val in their possibleOutcomes array 

                    const ParentSchema = conn.model('Post', postSchema);
                    const parentDocument = ParentSchema.findById(this.parent().parent);

                    return new Promise(async function(resolve, reject) {
                        const doc = await parentDocument;
                        const outcome = doc.extra.possibleOutcomes.id(val);
                        if(outcome&&outcome._id.equals(val)){
                            resolve(true);
                        }else{
                            reject(false);
                        }
                        
                    });
                },
            }
        }),
        required: true,
    }
},
{
    timestamps: true
});

module.exports = conn.model('Post', postSchema);