let mongoose = require('mongoose');
let validator = require('validator');
let crypto = require('crypto');
let bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The Should be included']
    },
    email: {
        type: String,
        required: [true, 'The Email should be included.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Enter the valid email.']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'The Password should be included.'],
        select: false
    },
    passwordConformation: {
        type: String,
        required: [true, 'The Conformation password Should be included.'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'The password should be the same.'
        }
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    passwordChangeAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConformation = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
userSchema.methods.checkPassword = async function (userPassword, dataPassword) {
    return await bcrypt.compare(userPassword, dataPassword);
};

userSchema.methods.checkPassAfterToken = function (JWTCreatDate) {
    if (this.passwordChangeAt) {
        let getPerfectTime = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );

        return JWTCreatDate < getPerfectTime;
    }
    return false;
};

userSchema.methods.forgotPasswordResetToken = function () {
    let resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

let userModels = mongoose.model('User', userSchema);
module.exports = userModels;
