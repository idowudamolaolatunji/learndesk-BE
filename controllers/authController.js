const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');
const Admin = require('../models/adminModel');

const catchAsyncError = require('../utils/catchAsyncError');




// SIGNUP USERS
exports.usersSignup = async (req, res) => {
    try {
        // CHECK IF THE EMAIL HAS ALREADY BEEN USED
        const emailUsed = await User.findOne({ email: req.body.email });
        if(emailUsed) return res.status(400).json({
            message: 'Email Already Used!'
        })

        // CREATE THE USER DOCUMENT
        const user = await User.create({
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            fullName: req.body.fullName,
            role: req.body.role,
        });

        // PERFORM OTP VERIFICATION HERE BEFORE SENDING BACK THE RESPONSE

        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

// this is only here temporarily
exports.createAdmins = async(req, res) => {
    try {
        // CREATE THE ADMIN DOCUMENT
        const admin = await Admin.create({
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            name: req.body.name,
        });

        res.status(201).json({
            status: 'success',
            data: {
                admin
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


// LOGIN USERS 
exports.usersLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        // FIND THE USER DOCUMENT BASED ON THE EMAIL AND ALSO SELECT PASSWORD TO TRUE
        const user = await User.findOne({ email: email }).select('+password');

        // CHECK IF USER STILL EXIST
        if(!user || !user.isActive) return res.status(404).json({
            message: 'Account no longer exist!'
        });

        // COMPARE THE USER PASSWORD WITH THE HASHED PASSWORD
        if(!user.email || !(await user.comparePassword(password, user.password))) {
            return res.status(404).json({
                message: 'email or password incorrect!'
            });
        }

        // NOW SIGN THE TOKEN AND GRANT THE USER ACCESS
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // DEFINE SOME COOKIE OPTIONS AND THE SET THE COOKIE
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }
        res.cookie('jwt', token, cookieOptions);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully LoggedIn',
            data: {
                user
            },
            token
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


// LOGIN ADMIN
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // FIND THE ADMIN DOCUMENT BASED ON THE EMAIL AND ALSO SELECT PASSWORD TO TRUE
        const admin = await Admin.findOne({ email: email }).select('+password');

        // COMPARE THE ADMIN PASSWORD WITH THE HASHED PASSWORD
        if(!admin.email || !(await admin.comparePassword(password, admin.password))) {
            return res.status(404).json({
                message: 'email or password incorrect!'
            });
        }

        // NOW SIGN THE TOKEN AND GRANT THE ADMIN ACCESS
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // DEFINE SOME COOKIE OPTIONS AND THE SET THE COOKIE
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }
        res.cookie('jwt', token, cookieOptions);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully LoggedIn',
            data: {
                admin
            },
            token
        });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}


// BECOME AN INTRUCTOR
exports.becomeAnInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user || user.role === 'instructor') {
            return res.json({
                message: ''
            });
        }

        user.isAlsoBoth = true,
        user.firstName = req.body.firstName;
        user.lastNAme = req.body.lastNAme;
        user.headline = req.body.headline;
        user.biography = req.body.headline;
        user.language = req.body.language;
        user.website = req.body.websiteLink;
        user.twitter = req.body.twitterLink;
        user.facebook = req.body.facebookLink;
        user.youtube = req.body.youtubeLink;
        user.linkedin = req.body.linkedinLink;
        user.save({ validateBeforeSave: true });

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
} 



// BECOME A STUDENT
exports.becomeaStudent = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user || user.role === 'student') {
            return res.json({
                message: ''
            });
        }

        // PASS IN THE NECESSARY PARAMETERS FOR THE INSTUCTOR TO BECOME A STUDENT ALSO
        

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}