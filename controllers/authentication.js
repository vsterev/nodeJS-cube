const { userModel, tokenBlacklistModel } = require('../models')
const { createToken, verifyToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
function signin(req, res, next) {
    const token = createToken({ userID: req.user.id });
    res.cookie('auth-cookie', token).redirect('/')
}

function login(req, res) {
    res.render('login.hbs')
}
function loginPost(req, res, next) {
    const { username, password } = req.body;
    userModel.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('login', { errors: { username: `This user ${username} not exist!` } });
                return;
            }
            Promise.all([user, user.matchPassword(password)])   //promise in promise - mot nested
                .then(([user, match]) => {
                    if (!match) {
                        res.render('login', { errors: { password: 'Password mismatch!' } });
                        return;
                    }
                    req.user = user;
                    const token = createToken({ userID: user.id });
                    res.cookie('auth-cookie', token).redirect('/');
                    return;
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
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
        .then((user) => {
            req.user = user;
            const token = createToken({ userID: user.id });
            res.cookie('auth-cookie', token).redirect('/');
            return;
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
    if (!token) {
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
function getPassChange(req, res, next) {
    const user = req.user;
    res.render('password-change', { user })
}
function postPassChange(req, res, next) {
    const user = req.user;
    const { oldPassword, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
        res.render('password-change', { user, errors: { password: 'Password mismatch !' } });
        return;
    }
    userModel.findById(user.id)
        .then((user) => {
            Promise.all([user, user.matchPassword(oldPassword)])
                .then(([user, match]) => {
                    if (!match) {
                        res.render('password-change', { user, errors: { password: 'Old Password doesn\'t correct' } })
                        return;
                    }
                    userModel.findByIdAndUpdate(user.id, { password })
                        .then((a) => {
                            console.log(a);
                            res.redirect('/')
                            return;
                        })
                        .catch(err => console.log(err))
                    return;
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}
module.exports = { login, loginPost, register, registerPost, logout, getPassChange, postPassChange }