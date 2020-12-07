const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const ReactionSchema = new Schema(
    {
        // new id is created upon reaction initialization
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        // text body
        reactionBody: {
            type: String,
            required: true,
            max: 280
        },
        // username of creator
        username: {
            type: String,
            required: true
        },
        // timestamp
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createAtVal) => {
                return moment(createAtVal).format('M/D h:m a');
            }
        }           
    }
)

const ThoughtSchema = new Schema(
    {
        // thought text
        thoughtText: {
            type: String,
            required: true,
            min: 1,
            max: 280
        },
        // timestamp
        createAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => {
                return moment(createdAtVal).format('M/D h:m a');
            }
        },
        // creator's username
        username: {
            type: String,
            required: true
        },
        reactions: [ReactionSchema]
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        // stops Id redundancy
        id: false
    }
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;