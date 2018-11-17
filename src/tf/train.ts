// tslint:disable:no-console
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

import { batchSize, epochs, modelName } from "../constants";
import { dataToTensors, getData } from "./data";
import { createModel } from "./model";

// const metrics = ["loss", "val_loss", "acc", "val_acc"];
// const container = { name: "model.fit metrics", tab: "Training" };
// const callbacks = tfvis.show.fitCallbacks(container, metrics);

// Model is too large for DataStorage
// const saveModelPath = "localstorage://nanny_model";
const saveModelPath = "indexeddb://nanny_model";

export const loadTrainedModel = async () => {
  // Load a model from files:

  const modelArchResponse = await fetch(`./${modelName}/model.json`);
  const modelArchBlob = await modelArchResponse.blob();
  const modelArch = new File([modelArchBlob], "model.json");

  const modelWeightsResponse = await fetch(`./${modelName}/weights.bin`);
  const modelWeightsBlob = await modelWeightsResponse.blob();
  const modelWeights = new File([modelWeightsBlob], "weights.bin");

  const io = tf.io.browserFiles([modelArch, modelWeights]);
  const model = await tf.loadModel(io);

  console.log("Model loaded");

  return model;
};

const batchLoss: tf.Logs[] = [];
const epochAccHistory: tf.Logs[] = [];

const callbacks: tf.CustomCallbackConfig = {
  onBatchEnd: async (batch, logs) => {
    console.log("Batch", batch);
    if (logs) {
      batchLoss.push(logs);
    }

    tfvis.show.history(
      { name: "Loss on Batch End", tab: "Training" },
      batchLoss,
      ["loss"]
    );
    // await tf.nextFrame();
  },
  onEpochEnd: async (epoch, logs) => {
    console.log("Epoch", epoch);
    if (logs) {
      epochAccHistory.push(logs);
    }

    tfvis.show.history(
      { name: "Accuracy on Epoch End", tab: "Training" },
      epochAccHistory,
      ["acc", "val_acc"]
    );
  }
};

export const trainModel = async () => {
  console.log("Downloading data");
  const data = await getData();

  console.log("Converting data to tensors");
  const { xTrain, yTrain, xTest, yTest } = dataToTensors(data);

  console.log("Creating model");
  const model = createModel();

  console.log("Training...");
  await model.fit(xTrain, yTrain, {
    batchSize,
    callbacks,
    epochs,
    validationData: [xTest, yTest]
  });

  console.log("Saving model...");
  await model.save(`downloads://${modelName}`);

  console.log("Model saved");
  return model;
};
