import React from "react";

import "./Input.css";

function Input({ disabled, value, type, onChange, placeholder }) {
  return (
    <React.Fragment>
      <li className="editing">
        <input
          className="edit Input"
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </li>
    </React.Fragment>
  );
}

export default Input;
