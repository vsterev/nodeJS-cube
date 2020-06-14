const { userModel, tokenBlacklistModel } = require('../models')
const { createToken, verifyToken } = require('../utils/jwt')

function login(req, res) {
    res.render('login.hbs')
}
function loginPost(req, res, next) {
    const { username, password } = req.body;
    userModel.findOne({ username })
        .then(user => Promise.all([user, user.matchPassword(password)])   //promise in promise - mot nested
            .then(([user, match]) => {
                if (!user) {
                    res.render('login', { errors: { username: `This user ${username} not exist!` } });
                    return;
                }
                if (!match) {
                    res.render('login', { errors: { password: 'Password mismatch!' } });
                    return;
                }
                const token = createToken({ userID: user.id });
                res.cookie('auth-cookie', token).redirect('/')
                return;
            })
            .catch(err => next(err))
        )
        .catch(err => next(err))
}
function register(req, res) {
    res.render('register')
}
function registerPost(req, res, next) {
    const { username, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        res.render('register.hbs', { errors: { password: 'Password and repeatpassword don\'t match' } })
        return;
    }
    userModel.create({ username, password })
        .then(() => {
            return res.redirect('/login')
        })
        .catch(err => {
            if (err.code = 11000 && err.name === 'MongoError') {
                res.render('register', { errors: { username: 'User already exist' } })
                return;
            }
            console.log(err);
        })
}
function logout(req, res, next) {
    // const token = req.cookies['auth-cookie'];
    const token = req.token || req.cookies['auth-cookie'];
    if (!token){
        res.redirect('/');
        return;
    }
    tokenBlacklistModel.create({ token })
        .then(() => {
            res.clearCookie('auth-cookie');
            res.status(200).redirect('/');
        })
        .catch(err => next(err))
}
module.exports = { login, loginPost, register, registerPost, logout }