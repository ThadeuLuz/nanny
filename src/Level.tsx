import React from "React";

const styles = {
  level: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: "100%"
  },
  wrapper: {
    backgroundColor: "#ffffff33",
    borderRadius: 20,
    display: "inline-block",
    height: 20,
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
