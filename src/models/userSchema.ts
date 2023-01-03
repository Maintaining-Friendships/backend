declare global {
  namespace Express {
    export interface Request {
      user: IUser;
      friend: IFriend;
    }
  }
}

export interface IUser {
  firstName: String;
  lastName: String;
  countryCode: String;
  phoneNo: String;
  profilePicture: String;
  friends: IFriend[];
}

export interface IFriend {
  userID: String;
  importance: Number;
  lastReachedOut?: Date | null;
}
