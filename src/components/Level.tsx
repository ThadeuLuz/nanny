import React from "React";

const height = 15;

const styles = {
  level: {
    backgroundColor: "#fff",
    borderRadius: height / 2,
    height: "100%",
    minWidth: height
  },
  wrapper: {
    backgroundColor: "#ffffff33",
    borderRadius: height / 2,
    display: "inline-block",
    height,
    maxWidth: 400,
    width: "60%"
  }
};

interface IProps {
  value: number;
}

const Level = ({ value }: IProps) => (
  <div style={styles.wrapper}>
    <div style={{ ...styles.level, width: `${Math.round(value * 100)}%` }} />
  </div>
);

export default Level;
