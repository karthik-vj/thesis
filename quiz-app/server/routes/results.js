const express = require('express');
const Quizzes = require('../models/Quiz');
const checkAuth = require('../middleware/check-auth');
const Users = require('../models/users');
const Score = require('../models/Scores');
const student = require('../models/studentModel')


const router = express.Router();

router.get('/all-student', (req, res) => {
    student.find()
        .then(result => {
            res.status(200).json(result);
        })
})
router.get('/student/:userId', (req, res) => {
    student.find({userId: req.params.userId})
        .then(result => {
            res.status(200).json(result);
        })
})
router.get('/allresult/:userId/:quizId',( req, res) => {
    Score.find({quizId: req.params.quizId,userId: req.params.userId}).then(result => {
        res.status(200).json(result);
    })
  });

router.get('/all-result/:userId/:quizId',( req, res) => {
    Score.find({quizId: req.params.quizId,userId: req.params.userId}).sort({$natural:-1}).limit(1).then(result => {
        res.status(200).json(result);
    })
  });

  router.get('/all-result/:userId/:hangmanId',( req, res) => {
    Score.find({hangmanId: req.params.hangmanId,userId: req.params.userId}).sort({$natural:-1}).limit(1).then(result => {
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
router.post('/create',(req,res)=>{
    let Student = new student({
        quizId: req.body.quizId,
        userId: req.body.userId,
        Result: req.body.Result
    })
    Student.save().then(_result => {
        res.status(200).json({success: true});
    })
})

router.post('/create-hangman',(req,res)=>{
    let Student = new student({
        hangmanId: req.body.hangmanId,
        userId: req.body.userId,
        Result: req.body.Result
    })
    Student.save().then(_result => {
        res.status(200).json({success: true});
    })
})
router.get('/all-students/:userId/:quizId',(req,res)=>{
    student.find({quizId: req.params.quizId,userId: req.params.userId}).sort({$natural:-1}).limit(1).then(result => {
        res.status(200).json(result);
    })
})

router.get('/all-students/:userId/:hangmanId',(req,res)=>{
    student.find({hangmanId: req.params.hangmanId,userId: req.params.userId}).sort({$natural:-1}).limit(1).then(result => {
        res.status(200).json(result);
    })
})

router.post('/update-student/:id',(req,res)=>{
    student.findByIdAndUpdate({_id: req.params.id},{$set:{Result: req.body.Result}}).then(data=>{
        res.status(200).json(data)
    })
})

module.exports = router;