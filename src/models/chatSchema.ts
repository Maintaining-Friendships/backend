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
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  message: string;
  time: Timestamp;
}
