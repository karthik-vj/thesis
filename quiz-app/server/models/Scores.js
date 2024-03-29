const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectID,
        required: false
    },
    answers: {
        type: Array,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectID,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    deleted: {
        type: Boolean,
        default: false
    },
    accountResult:{
        type: Number,
        default: 0
    },
    hangmanId: {
        type: Schema.Types.ObjectID,
        required: false
    },
    
});

module.exports = Scores = mongoose.model("Scores", ScoreSchema);