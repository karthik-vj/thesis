const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentModelSchema = new Schema({
    quizId: {
        type: Schema.Types.ObjectID,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectID,
        required: true
    },
    Result:{
        type: Number,
        default: 0
    },
    hangmanId: {
        type: Schema.Types.ObjectID,
        required: false
    }
});

module.exports = Student = mongoose.model("Student", StudentModelSchema);