const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String }
})
userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password) //password verification in model
    }
}
userSchema.pre('save', function (next) { //hash when saving password
    if (this.isModified('password')) {

        // bcrypt.genSalt(9)
        //     .then(salt => {
        //         bcrypt.hash(this.password, salt)
        //             .then(hash => {
        //                 this.password = hash;
        //                 next()
        //             })
        //             .catch(err => console.log(err))
        //     })
        //     .catch(err => console.log(err))

        const saltGenerate = bcrypt.genSalt(9)
        saltGenerate
            .then(salt => {
                const hash = bcrypt.hash(this.password, salt)
                Promise.all([salt, hash])
                    .then(([salt, hash]) => {
                        this.password = hash;
                        next();
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))

        // bcrypt.genSalt(10, (err, salt) => {
        //     if (err) { next(err); return }
        //     bcrypt.hash(this.password, salt, (err, hash) => {
        //         if (err) { next(err); return }
        //         this.password = hash;
        //         next();
        // })
        // })
        return;
    }
    next();
})
module.exports = mongoose.model('User', userSchema);