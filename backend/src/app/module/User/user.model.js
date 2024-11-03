import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config/index.js';

const userSchema = new Schema(
  {
       email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    
      name: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "superUser"],
      default: "user",
      required: true,
    }

  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this; // doc
  // hashing password and saving it into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// Set password to an empty string after saving
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model('User', userSchema);




