import React, { Component } from "React";

import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Pets";

interface IToggleProps {
  text: string;
}

interface IToggleState {
  value: number;
}

const pets = ["🐶", "🐱", "🐰", "🐹"];

export default class Toggle extends Component<IToggleProps, IToggleState> {
  public state = {
    value: 0
  };

  public render() {
    const { value } = this.state;
    const { text } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        <h1>{pets[value % pets.length]}</h1>
        <Button variant="contained" color="secondary" onClick={this.toggle}>
          <HomeIcon />
          {text}
        </Button>
      </div>
    );
  }

  private toggle = () => {
    this.setState({ value: this.state.value + 1 });
  };
}
