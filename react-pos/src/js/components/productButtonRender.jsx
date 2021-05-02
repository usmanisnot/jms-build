import React from "react";

export default (props) => {
  const buttonClicked = () => {
    alert(` medals won!`);
  };

  return (
    <span>
      <button onClick={() => buttonClicked()}>Delete</button>
    </span>
  );
};
