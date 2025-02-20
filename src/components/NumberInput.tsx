import React from "react";

interface NumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
  id: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ value, onChange, maxLength, id }) => {
  return (
    <input
      id={id}
      type="text"
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      className="input bg-gray-100 px-2 py-2 rounded-md custom-input w-12 text-center"
    />
  );
};

export default NumberInput;
