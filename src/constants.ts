export type Labels = string[];

export const labels: Labels = ["false", "true"];

export const modelName = "nanny";
export const sampleRate = 44100;
export const bufferSize = 512;
export const mfccSize = 13;
export const xSize = 100;
export const xStep = 50;

export const batchSize = 100;
export const epochs = 5;
export const learningRate = 0.001;
export const testSplit = 0.2;

// MFCC is an array of 13 numbers
export type MFCC = number[];

// X (Input) is an array of xSize MFCCs
export type X = MFCC[];

// Y (output) is either 0 or 1 (binary classification)
export type Y = 0 | 1;

// Row is X and Y
export type Row = [X, Y];

// Data is a bunch of examples
export interface IData {
  xTrain: X[];
  xTest: X[];
  yTrain: Y[];
  yTest: Y[];
}
