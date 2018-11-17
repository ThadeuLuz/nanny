// tslint:disable:no-console

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";
import * as fs from "fs-extra";
// @ts-ignore
import * as Meyda from "meyda";
// @ts-ignore
import * as wav from "node-wav";

import {
  bufferSize,
  IData,
  labels,
  MFCC,
  Row,
  testSplit,
  X,
  xSize,
  xStep,
  Y
} from "../src/constants";

/**
 * Splits signal into chunkSize and extracts MFCC in each one of them.
 * @param signal
 * @param chunkSize
 */
const signalToMfccs = (signal: Float32Array, size = bufferSize): MFCC[] => {
  // Create an array with the right size;
  const mfccs = Array(Math.floor(signal.length / size))
    .fill(0)
    .map((_, i) => {
      // Get the signal chunk
      const signalChunk = signal.subarray(i * size, (i + 1) * size);
      // Returns the chunk mfcc
      return Meyda.extract("mfcc", signalChunk);
    });

  return mfccs;
};

const getRows = () => {
  const rows: Row[] = [];

  labels.forEach(label => {
    const fileNames = fs
      .readdirSync(`./data/${label}`)
      // Uses only .wav files (filters .DS_Store and others)
      .filter(fn => fn.endsWith(".wav"));

    // Label for this folder
    const y: Y = labels.indexOf(label) ? 1 : 0;

    fileNames.forEach((fileName, i) => {
      // Reads buffers
      const buffer = fs.readFileSync(`./data/${label}/${fileName}`);
      // Decode and get only the first channel

      const wavf = wav.decode(buffer);
      const signal = wavf.channelData[0];

      // Get mfcc with meyda
      const mfccs = signalToMfccs(signal);

      // xBuffer is a rotating list of mfccs of variable size. When the lenght
      // reaches xSize, we push a row and remove the first xStep items
      const xBuffer: MFCC[] = [];

      let examplesCount = 0;
      mfccs.forEach(mfcc => {
        // Adds mfcc to xBuffer
        xBuffer.push(mfcc);

        if (xBuffer.length === xSize) {
          // Push Example. This .slice() is important!
          rows.push([xBuffer.slice() as X, y]);
          examplesCount++;

          // Remove items from xBuffer
          xBuffer.splice(0, xStep);
        }
      });

      console.log(
        `Preprocessing (${i}/${
          fileNames.length
        }) ${label}/${fileName}. Added ${examplesCount} examples.`
      );
    });
  });

  return rows;
};

const getData = () => {
  const rows = getRows();
  const numExamples = rows.length;

  // Shuffle
  tf.util.shuffle(rows);

  const xTrain: X[] = [];
  const yTrain: Y[] = [];

  rows.forEach(([x, y]) => {
    xTrain.push(x);
    yTrain.push(y);
  });

  // Split
  const numTest = Math.round(numExamples * testSplit);
  const xTest = xTrain.splice(0, numTest);
  const yTest = yTrain.splice(0, numTest);

  return { xTest, xTrain, yTest, yTrain };
};

// Save mfccs to file
fs.writeJsonSync("./src/static/data.json", getData());
