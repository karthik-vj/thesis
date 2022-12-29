const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HangmanSchema = new Schema({
    mustBeSignedIn: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    }
    ,category: {
        type: String,
    },
    questions: [{
        type: Object,
        contains: {
            answers: String,
            correctAnswer: String,
            questionName: String
        }
    }],
    skills:{
        type: String,
        required: true
    },
    passGrade: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: Schema.Types.ObjectID,
        required: true
    },
    scores: {type: Array, default: []},
    createdAt: {
        type: Date,
        default: new Date()
    }
})

module.exports = User = mongoose.model('Hangman', HangmanSchema);