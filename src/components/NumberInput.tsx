
import React from "react";

interface NumberInputProps {
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      maxLength={1}
      value={value}
      onChange={onChange}
      className="input bg-gray-100 px-2 py-2 rounded-md custom-input w-12 "
    />
  );
};

export default NumberInput;
