const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//importing libraries to prevent from attack
const hpp = require('hpp');
const xss = require('xss-clean');
const helmet = require('helmet');

const userRouter = require('./Route/userRouter')

app.set('view engine', 'ejs');
// app.set('views', './views');

// prevent as security http headers
app.use(helmet());

//data sanitization against no sql injection
app.use(xss());

//prevent from parameter pollution
app.use(hpp());


app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//Database Connection
mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('Connection is successfull'))
    .catch((err) => console.log('Connection is failed', err));

//Route
app.use('/user', userRouter);

//Server Running
app.listen(process.env.PORT);