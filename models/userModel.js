const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    storeName: { type: String, required: [function() { return this.role === 'seller'; }, "Store name is required for sellers"]},
    createdAt: { type: Date, default: Date.now },
    password: { type: String, required: true, select: false },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
        validator: function(el) {
            return el === this.password;
        },
        message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    address : {type : String , required: [function() { return ['seller','customer'].includes(this.role); }, "address is required"]}
});
    
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
}
);

userSchema.pre(/^find/, function(next) {
this.find({ active: { $ne: false } });
next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
    );

    return JWTTimestamp < changedTimestamp;
}

return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
