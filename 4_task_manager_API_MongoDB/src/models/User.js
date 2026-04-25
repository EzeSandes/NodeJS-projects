import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name.'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    password: {
      type: String,
      required: [true, 'A user must have a password.'],
      minlength: 8,
      select: false, // No present in the output
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      validate: {
        // Only works on CREATE or SAVE!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password are not the same',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false, // We dont return by default in the querys.
    },
  },
  {
    timestamps: true,
  },
);

// ==================== MIDDLEWARE (pre-save) ====================
// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only if the password was modified (or it new).
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  /* 
  'passwordConfirm' is only used to validate that the user entered the correct password.
  It is not needed beyond validation, so it is removed before persisting to the database
  by setting it to 'undefined'.

  The 'required' constraint applies only at the input validation level.
*/
  this.passwordConfirm = undefined;
});

// ==================== INSTANCE METHODS ====================

/*
  #DOC: https://mongoosejs.com/docs/guide.html#methods
  Functions defined on a schema that are available on each document (instance) created from that model.

  They operate on the specific document’s data using `this`.

  Use them for logic that depends on a single document
  (e.g., password validation, token generation).
*/

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // this.password: No because it has 'select': false => Its not present in the output.
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
