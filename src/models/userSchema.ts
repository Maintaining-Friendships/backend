import mongoose from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}

export interface IUser {
  firstName: String;
  lastName: String;
  countryCode: String;
  phoneNo: String;
  profilePicture: String;
  friends: {
    name: String;
    phoneNo: String;
    userID: String;
    importance: Number;
    lastReachedOut: Date;
  }[];
}

var UserSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    default: "",
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    default: "",
    trim: true,
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true,
  },
  profilePicture: {
    type: String,
    default: null,
    trim: true,
  },
  friends: {
    type: [],
    default: [],
  },
});

export const USER = mongoose.model<IUser>("individual_user", UserSchema);
