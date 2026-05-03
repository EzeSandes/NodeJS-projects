import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'A user must have a username.'],
      unique: true,
      trim: true,
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a vaid email'],
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same.',
      },
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  { timestamps: true },
);

// ==================== MIDDLEWARE (pre-save) ====================

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  // next();
});

// ==================== INSTANCE METHODS ====================

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // this.password: No because it has 'select': false => Its not present in the output.
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
