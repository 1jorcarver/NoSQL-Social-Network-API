const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address.']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

UserSchema.post('findOneAndDelete', function(doc) {
    
    const thoughts = doc.thoughts;

    for (let i = 0; i < thoughts.length; i++) {
        Thought.findOneAndDelete({ _id: thoughts[i] })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return new Error('No thought with this id!')
            }
            return dbThoughtData;
        })
        .catch(err => res.json(err));
    }
});

const User = model('User', UserSchema);

module.exports = User;