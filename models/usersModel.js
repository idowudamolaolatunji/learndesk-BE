const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Enter a valid email"],
        lowercase: true
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Password are not the same!'
        },
    },
    role: {
        type: String,
        enum: ['instructor', 'student'],
        default: 'student',
        required: true
    },


    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});


// SCHEMA MIDDLEWARES
const saltRound = 12;
userSchema.pre('save', async function(next) {
    // CHECK IF PASSWORD IS ALREADY MODIFIED
    if(!this.isModified('password')) return next();

    // IF NOT HAS THE PASSWORD
    const hashedPassword = await bcrypt.hash(this.password, saltRound);
    this.password = hashedPassword;
    this.passwordConfirm = undefined

    next();
});

userSchema.pre("save", function (next) {
	const slug = slugify(this.username, { lower: true });
	this.slug = `${slug}-${this._id}`;
	next();
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) return next();
	this.passwordChangedAt = Date.now() - 100;
	next();
});

// INSTANCE METHOD
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
		return jwtTimeStamp < changeTimeStamp;
	}
	// return false means not changed
	return false;
};
userSchema.methods.comparePassword = async function (candidatePassword, hashedPassword) {
	const encrypted = await bcrypt.compare(candidatePassword, hashedPassword);
	return encrypted;
};
userSchema.methods.createPasswordResetToken = function () {
	// create random bytes token
	const resetToken = crypto.randomBytes(32).toString("hex");

	// simple hash random bytes token
	const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetToken = hashedToken;

	// create time limit for token to expire (10 mins)
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
	// send the unencrypted version
};