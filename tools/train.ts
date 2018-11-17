// tslint:disable:no-console
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-node";
import fs from "fs-extra";

import { batchSize, epochs, IData, modelName } from "../src/constants";
import { dataToTensors } from "../src/tf/data";
import { createModel } from "../src/tf/model";

const callbacks: tf.CustomCallbackConfig = {
  onBatchEnd: async (n: number, logs?: tf.Logs) => console.log("Batch", n)
  // onEpochEnd: async (n: number, logs?: tf.Logs) => console.log("Epoch", n)
};

const train = async () => {
  console.log("Reading Data");
  const data: IData = fs.readJSONSync("./src/static/data.json");

  console.log("Converting data to tensors");
  const { xTrain, yTrain, xTest, yTest } = dataToTensors(data);

  console.log("Creating model");
  const model = createModel();
  model.summary();

  console.log("Training model");
  const result = await model.fit(xTrain, yTrain, {
    batchSize,
    // callbacks,
    epochs,
    validationData: [xTest, yTest]
  });

  console.log(result.history);

  model.save(`file://./src/static/${modelName}`);
};

train();
