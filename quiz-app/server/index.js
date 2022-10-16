const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const userRoutes = require('../server/routes/users')
const quizRoutes = require('./routes/quizzes')
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 9000;
let server;

app.use(cors());
app.use(bodyParser.urlencoded({extended : true, limit: '20mb'}));
app.use(bodyParser.json({limit: '20mb'}));

app.use('/api/users/', userRoutes);
app.use('/api/quizzes/', quizRoutes);

mongoose.connect(process.env.DB_URI,{
    useUnifiedTopology : true,
    useNewUrlParser: true
}).then(() => console.log('Connection established'))
.catch(er => console.log('error connecting the database'))

server = app.listen(PORT, () => {
    console.log(`node server running on : ${PORT}`)
})