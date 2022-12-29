const express = require('express');
const Hangman = require('../models/Hangman');
const checkAuth = require('../middleware/check-auth');
const Users = require('../models/users');
const Score = require('../models/Scores');
const { data } = require('jquery');

const router = express.Router();

router.post('/create', checkAuth, (req, res) => {
    let hangman = new Hangman({
        ...req.body.hangman,
        createdBy: req.body.createdBy,
        questions: req.body.hangman.questions.map(ques => {
            return {
                ...ques,
                answers: ques.answers
            }
        })
    });
    hangman.save().then(result => {
        res.status(200).json({success: true});
    })
});

router.get("/my-hangman/:id", checkAuth, (req, res) => {
    Hangman.find({ createdBy: req.params.id })
        .then(result => {
            res.status(200).json(result);
        })
});

router.get('/get-hangman/:id', checkAuth, (req, res) => {
    Hangman.findOne({ _id: req.params.id }).then(hangman => {
        res.status(200).json({hangman});
    }).catch(er => {
        res.status(500).send(er);
    })
})
router.get('/all-hangman', checkAuth, (req, res) => {
    Hangman.find()
        .then(result => {
            res.status(200).json(result);
        })
})

module.exports = router;