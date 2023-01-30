import { Timestamp } from "@google-cloud/firestore";

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
      friend: IFriend;
    }
  }
}

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNo: string;
  profilePicture: string;
  friends: IFriend[];
  lastConvo: Timestamp | null;
}

export interface IFriend {
  userID: string | null;
  importance: number;
  lastReachedOut: Timestamp | null;
  friendsPhone: string;
}
