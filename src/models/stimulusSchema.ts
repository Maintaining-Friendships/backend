declare global {
  namespace Express {
    export interface Request {
      stimulus: IStimulus;
    }
  }
}

export interface IStimulus {
  textBased: string;
}
