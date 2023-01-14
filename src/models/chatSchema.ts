import { Timestamp } from "@google-cloud/firestore";

declare global {
  namespace Express {
    export interface Request {
      chat: IChat;
      message: IMessage;
    }
  }
}

export interface IChat {
  members: string[];
  stimulus: string;
}

export interface IMessage {
  senderId: string;
  message: string;
  time: Timestamp;
}
