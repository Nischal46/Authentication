const Userdto = require("../Model/userModel");
const bcrypt = require('bcryptjs');
const axios = require('axios');
const nodemailer = require('nodemailer');
const randomString = require('randomstring');


//(2FA) Mail sent for the user at the new registration
const sendVerifyEmail = async (name, email, userId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Website Email Verification',
            html: '<p>Hi, ' + name + '. Please click to <a href="http://localhost:8000/user/verify?id=' + userId + '">verify </a> your email</p>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent', info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }

}

//(2FA) mail sent to the user for the reseting of the password.

const sendResetPassmail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Reset Password',
            html: '<p>Hi, ' + name + '. Please click to <a href="http://localhost:5173/changepass/' + token + '">Reset </a> your password</p>'
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent', info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }

}

exports.registerUser = (req, res) => {
    try {
        const { name, email, password, confirmPassword, captchaval } = req.body;
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${captchaval}`)
            .then(async ({ data }) => {
                console.log(data);
                if (data.success) {
                    const registeruser = await Userdto.create({ name, email, password, confirmPassword });
                    if (registeruser) {
                        sendVerifyEmail(name, email, registeruser._id);
                        res.status(200).json({
                            status: 'success',
                            data: registeruser
                        })
                    }
                }
                else {
                    return res.status(400).json({ status: 'failed', message: 'Invalid captcha verification.' })
                }
            })

    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            message: 'Bad Request',
            error: error
        })
    }
};

exports.verifyMail = async (req, res) => {
    try {
        const verifiedUser = await Userdto.updateOne({ _id: req.query.id }, { $set: { isVerified: 1 } });
        console.log(verifiedUser);
        res.render('emailverified');

    } catch (error) {
        console.log(error);
    }
}


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({
            status: 'failed',
            message: "Please filled all the credentials"
        })
        const loginuser = await Userdto.findOne({ email });

        if (!loginuser || !(await loginuser.correctPass(password, loginuser.password))) return res.status(400).json({
            status: 'failed',
            message: 'Incorrect Email or Password'
        });

        if (loginuser.isVerified === 0) {
            return res.status(400).json({
                status: 'failed',
                message: 'You are not verified yet. check email and verified first.'
            })
        }

        else {
            res.status(200).json({
                status: 'success',
                data: loginuser
            })

        }


    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: "Bad Request"
        })
    }
}


exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    const checkUser = await Userdto.findOne({ email });

    if (!checkUser) res.status(400).json({ status: 'failed', message: "User Email is incorrect" });
    else {

        if (checkUser.isVerified === 0) res.status(400).json({ status: "failed", message: "This email is not verified yet. Please verified it first by mail." })

        else {
            const randomText = randomString.generate();
            const passToken = await Userdto.updateOne({ email: email }, { $set: { token: randomText } });
            sendResetPassmail(checkUser.name, checkUser.email, randomText);
            res.status(200).json({
                status: 'success',
                message: 'Please check your mail'
            })
        }

    }

}


exports.verifyPass = async (req, res, next) => {
    try {
        const token = req.query.token;
        console.log('The token is', token);
        const tokenData = await Userdto.findOne({ token });
        req.userID = tokenData._id;


        if (!tokenData) res.status(400).json({ status: 'failed', message: "Invalid pass token" });

        console.log(req.userID);
        console.log('This is', req.userID);



    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: error
        })
    }
    next();
}

exports.changePassword = async (req, res) => {
    try {
        console.log(req.params.id);
        const { password } = req.body;
        const encryptedPass = await bcrypt.hash(password, 12);

        const finalPassword = await Userdto.findOne({ token: req.params.id });
        console.log(finalPassword.email, finalPassword._id);

        const lastPass = await Userdto.findByIdAndUpdate(finalPassword._id, { password: encryptedPass, token: "" }, { new: true, runValidators: true })

        res.status(200).json({ status: 'success', data: lastPass });

    } catch (error) {
        res.status(400).json({
            status: 'failed',
            error: error.message
        })
    }
}