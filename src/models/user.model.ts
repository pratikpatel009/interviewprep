import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  mobile: number;
  role: string;
  gender: string;
  avatar: string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 10,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: "user",
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generateAccessToken = function (): string {
  const payload = {
    _id: this._id,
  };
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, options);
};

const User = mongoose.model("User", UserSchema);

export default User;
