const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Missing Name']
    },

    email: {
        type: String,
        required: [true, 'Missing Email'],
        validate: [validator.isEmail, 'Please insert a valid email'],
        unique: [true, 'Email entered is already taken']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'Please insert a password'],
        validate: {
            validator: function (el) {
                return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+[\]{};':"\\|,.<>/?~`]).{8,}$/.test(el);
            },
            message: 'Password must contain 1 each character of number, uppercase lowercase and symbol'
        }
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please insert a confirm password'],
        validate: {
            validator: function (el) {
                return this.password === el;
            },
            message: 'Password does not match'
        }
    },

    isVerified: {
        type: Number,
        default: 0
    },

    token: {
        type: String,
        default: ''
    }

});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPass = async function (password, userpass) {
    return await bcrypt.compare(password, userpass);
}

const Userdto = mongoose.model("Userdb", userSchema);
module.exports = Userdto;