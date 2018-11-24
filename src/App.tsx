import React, { Component } from "react";

import * as tf from "@tensorflow/tfjs";
// @ts-ignore
import * as Meyda from "meyda";

import Button from "./components/Button";
import Level from "./components/Level";
import { bufferSize, MFCC, xSize } from "./constants";
import { loadTrainedModel, trainModel } from "./tf/train";

interface IFeatures {
  mfcc: MFCC;
  rms: any;
}

const input: MFCC[] = [];
let model: tf.Model;

const colorTrue = [245, 0, 87];
const colorFalse = [255, 193, 7];

interface IAppState {
  disabled?: boolean;
  score: number;
  volume: number;
}

const getColor = (score: number) => {
  const values = colorFalse.map((v, i) =>
    Math.round(v + (colorTrue[i] - v) * score)
  );
  return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
};

const babies = ["😴", "😐", "😭"];

class App extends Component<{}, IAppState> {
  public state = {
    disabled: false,
    score: 0,
    volume: 0
  };

  public trainNewModel = async () => {
    this.setState({ disabled: true });
    model = await trainModel();
    this.analyzeMic();
    // this.analyzeAudio();
  };

  public loadTrained = async () => {
    this.setState({ disabled: true });
    model = await loadTrainedModel();
    this.analyzeMic();
    // this.analyzeAudio();
  };

  public async analyzeAudio() {
    const audioContext = new AudioContext();
    const elvis = document.getElementById("audio") as HTMLMediaElement;
    const source = audioContext.createMediaElementSource(elvis);
    source.connect(audioContext.destination);

    const analyzer = Meyda.createMeydaAnalyzer({
      audioContext,
      bufferSize,
      callback: this.callback,
      featureExtractors: ["mfcc", "rms"],
      source
    });

    analyzer.start();
  }

  public async analyzeMic() {
    navigator.getUserMedia =
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      navigator.getUserMedia ||
      navigator.mediaDevices.getUserMedia;

    const audioContext = new AudioContext();
    console.log(audioContext.sampleRate);

    const constraints = { video: false, audio: true };

    const successCallback = (mediaStream: MediaStream) => {
      const source = audioContext.createMediaStreamSource(mediaStream);

      const analyzer = Meyda.createMeydaAnalyzer({
        audioContext,
        bufferSize,
        callback: this.callback,
        featureExtractors: ["mfcc", "rms"],
        source
      });

      analyzer.start();
    };

    const errorCallback = (err: MediaStreamError) => console.error(err);
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }

  public callback = (features: IFeatures) => {
    input.push(features.mfcc);

    if (input.length === xSize) {
      const tensor = tf.tensor3d([input]);
      input.splice(0, 1);

      if (model) {
        const predictOut = model.predict(tensor) as tf.Tensor<tf.Rank.R2>;
        const score = predictOut.dataSync()[0];
        const volume = features.rms;
        this.setState({ score, volume });
        console.log(score, volume);
      }
    }
  };

  public render() {
    const { score, volume, disabled } = this.state;
    return (
      <div
        style={{
          backgroundColor: getColor(score),
          height: "100%",
          padding: "100px 0",
          width: "100%"
        }}
      >
        <h1 style={{ fontSize: "1000%", margin: "50px 0" }}>
          {score > 0.5 ? babies[2] : score > 0.25 ? babies[1] : babies[0]}
        </h1>

        <h1>
          😢&nbsp;
          <Level value={score} />
        </h1>
        <h1>
          🔊&nbsp;
          <Level value={volume} />
        </h1>

        <Button color="red" onClick={this.trainNewModel} disabled={disabled}>
          Treinar
        </Button>
        <Button color="blue" onClick={this.loadTrained} disabled={disabled}>
          Rodar
        </Button>
      </div>
    );
  }
}

export default App;
