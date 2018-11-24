import React from "react";

const styles: { button: React.CSSProperties } = {
  button: {
    border: "none",
    borderRadius: 4,
    color: "white",
    display: "inline-block",
    fontSize: 16,
    margin: "0 8px",
    padding: "15px 32px",
    textAlign: "center",
    textDecoration: "none"
  }
};

const Button = ({ children, color, disabled, ...props }: any) => (
  <button
    style={{ ...styles.button, backgroundColor: disabled ? "#aaa" : color }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
