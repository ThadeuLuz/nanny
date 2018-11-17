import * as tf from "@tensorflow/tfjs";

// import modelArchitecture from "../static/model.json";
// import modelWeights from "../static/model.weights.bin";
import { learningRate, mfccSize, xSize } from "./../constants";

export const createModel = () => {
  const layers: tf.layers.Layer[] = [
    tf.layers.conv1d({
      activation: "relu",
      filters: 32,
      inputShape: [xSize, mfccSize],
      kernelSize: [2]
    }),
    tf.layers.conv1d({
      activation: "relu",
      filters: 48,
      kernelSize: [2]
    }),
    tf.layers.conv1d({
      activation: "relu",
      filters: 120,
      kernelSize: [2]
    }),
    tf.layers.maxPooling1d({ poolSize: 2 }),
    tf.layers.dropout({ rate: 0.25 }),
    tf.layers.flatten(),
    tf.layers.dense({ units: 128, activation: "relu" }),
    tf.layers.dropout({ rate: 0.25 }),
    tf.layers.dense({ units: 64, activation: "relu" }),
    tf.layers.dropout({ rate: 0.4 }),
    tf.layers.dense({ units: 1, activation: "sigmoid" })
  ];

  const model = tf.sequential({ layers });
  model.summary();

  const optimizer = tf.train.adam(learningRate);
  model.compile({
    // loss: "categoricalCrossentropy",
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
    optimizer
  });

  return model;
};
