const express = require('express');
const Quizzes = require('../models/Quiz');
const checkAuth = require('../middleware/check-auth');
const Users = require('../models/users');
const Score = require('../models/Scores');
const { $where } = require('../models/users');

const router = express.Router();


router.get('/all-result/:id',( req, res) => {
    Score.find({userId: req.params.id,quizId: req.body.quizId}).sort({$natural:-1}).limit(1).then(result => {
        res.status(200).json(result);
    })
  });

router.get('/:id', (req, res) => {
    Score.findOne({ _id: req.params.id }).then(user => {
        res.json({ user, success: true })
    }).catch(er => {
        res.json({ success: false, message: er.message });
    })
})



module.exports = router;