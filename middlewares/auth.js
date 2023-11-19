const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/usersModel');

exports.authProtect = async (req, res, next) => {
    try {
        let token;

        // CHECK TOKEN AND GET TOKEN
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        } else if(req.cookie.jwt) {
            token = req.cookie.jwt
        }

        if(!token) {
            res.status(401).json({
                message: 'You are not logged in! Please log in to get access.'
            });
            return next();
        }

        // VERIFY THE TOKEN
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        req.user = {
            _id: decoded.id,
        }

        // CHECK IF THE USER EXIST
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            res.status(401).json({
                message: "The user belonging to this token does no longer exist.",
            });
            return next();
        }

        // CHECK IF THE USER CHANGED AFTER TOKEN WAS ISSUED
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            res.status(401).json({
                message: "User recently changed password! Please log in again."
            });
            return next();
        }

        // AT THIS POINT GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        res.locals.user = currentUser;

        next();
    } catch(err) {
        return res.status(401).json({
            status: 'fail',
            message: err.message || 'You are unauthorised',
        })
    }
}