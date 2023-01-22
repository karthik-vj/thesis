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
router.post('/save-results', checkAuth, (req, res) => {
    let score = new Score({
        userId: req.body.currentUser,
        answers: req.body.answers,
        hangmanId: req.body.hangmanId,
    });
    score.save().then(async resp => {
        await Hangman.updateOne({ _id: req.body.hangmanId }, {
            $push: {
                scores: resp._id
            }
        });
        res.status(200).json({scoreId: resp._id});
    })
});

router.get('/results/:id', checkAuth, (req, res) => {
    if (!req.params.id) {
        res.status(500).send("No id provided in params");
    } else {
        Score.findOne({_id: req.params.id}).then(data => {
            if (!data) {
                res.status(500).send("Error finding score");
            } else {
                Hangman.findOne({_id: data.hangmanId}).then(hangman => {
                    if (!hangman) {
                        res.status(500).send("Error getting quiz");
                    } else {
                        res.status(200).json({score: data, hangman: hangman});
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error finding score");
        })
    }
})
router.put('/update-results/:id', (req,res)=>{
    Score.findByIdAndUpdate({_id: req.params.id},{$set :{accountResult: req.body.accountResult}}).then(user =>{
        res.status(200).json(user)
    }).catch(er=>{
        res.json({message: er.message})
    })
})

module.exports = router;