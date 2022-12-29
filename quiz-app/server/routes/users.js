const express = require('express');
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const { cloudinary } = require('../config/cloudinary');
const { loginValidator, registerValidator } = require("../validators/validators");

const CryptoJS = require("crypto-js");
const { updateOne } = require('../models/users');

const router = express.Router();

router.post('/login', (req, res) => {
    
    const { errors, isValid } = loginValidator(req.body);
    if (!isValid) {
        res.json({ success: false, errors });
    } else {
        Users.findOne({ email: req.body.email }).then(user => {
            
            if (!user) {
                res.json({ message: 'Email does not exist', success: false });
            } else {
                bcrypt.compare(req.body.password, user.password).then(success => {
                    if (!success) {
                        res.json({ message: 'Invalid password', success: false });
                    } else {
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        jwt.sign(
                            payload,
                            process.env.APP_SECRET, { expiresIn: 2155926 },
                            (err, token) => {
                                res.json({
                                    user,
                                    token: 'Bearer token: ' + token,
                                    success: true
                                })
                            }
                        )
                    }
                })
            } 
        })
    }
})

router.post('/register', (req, res) => {
    const { errors, isValid } = registerValidator(req.body);
    if (!isValid) {
        res.json({ success: false, errors });
    } else {
        const { firstName, lastName, email, password } = req.body;
        const registerUser = new Users({
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date(),
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(registerUser.password, salt, (hashErr, hash) => {
                if (err || hashErr) {
                    res.json({ message: 'Error occured hasing', success: false });
                    return;
                }
                registerUser.password = hash;
                registerUser.save().then(() => {
                    res.json({ "message": "User created successfully", "success": true });
                }).catch(er => res.json({ message: er.message, success: false }));
            })
        })
    }
})

router.get('/all-users',checkAuth,( req, res) => {
    Users.find().then(result => {
        res.status(200).json(result);
    })
  });

  
router.get('/:id', (req, res) => {
    Users.findOne({ _id: req.params.id }).then(user => {
        res.json({ user, success: true })
    }).catch(er => {
        res.json({ success: false, message: er.message });
    })
})

router.post('/update-user/:id', (req,res)=>{
    Users.findByIdAndUpdate({_id: req.params.id},{$set: {accountType: req.body.accountType}}).then(user =>{
        res.status(200).json(user)
    }).catch(er=>{
        res.message(er)
    })
})  

router.put('/update/:id', async (req,res)=>{
    let result = await Users.updateOne({userId: req.params.id},
        {$set: {
            accountType: req.body.accountType
        }})
    res.json(result)
})

router.post('/upload-image', checkAuth, async(req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadedResponse = await cloudinary.uploader.upload(fileStr);
        Users.findOne({ _id: req.body._id }).then(user => {
            user.avatar = { url: uploadedResponse.url, publicId: uploadedResponse.public_id };
            user.save();
            if (user.images) {
                user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id });
            } else {
                user.images = [];
                user.images.push({ url: uploadedResponse.url, publicId: uploadedResponse.public_id })
            }
            res.json({ success: true });
        })
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: 'Something went wrong, try again.' })
    }
})

module.exports = router;