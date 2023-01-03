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
  countryCode: string;
  phoneNo: string;
  profilePicture: string;
  friends: IFriend[];
}

export interface IFriend {
  userID: string;
  importance: number;
  lastReachedOut: Date | null;
}
