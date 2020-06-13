const jwt = require('./jwt');
const { userModel, tokenBlacklistModel } = require('../models')

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        const token = req.cookies['auth-cookie'];
        // if (!token) {
        //     res.redirect('/');
        //     return;
        // }
        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ]).then(([data, blackListToken]) => {
            if (blackListToken) {
                return Promise.reject(new Error('blacklisted token'))
            }
            userModel.findById(data.userID)
                .then(user => {
                    // req.token = token;
                    req.user = user.username;
                    next();
                })
        }).catch(err => {
            if (!redirectUnauthenticated) {
                next();
                return;
            }
            if ([
                'token expired',
                'blacklisted token',
                'jwt must be provided'
            ].includes(err.message)
            ) {
                res.redirect('/login')
                return;
            }
            next(err)
        })
    }
}
module.exports = auth; 