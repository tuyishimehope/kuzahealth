import React, { useState } from 'react';

const NumberInput = () => {
  const [number, setNumber] = useState<number | string>(''); // Initially empty or a number

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber(value !== '' ? parseFloat(value) : ''); // Converts to a number or keeps it empty
  };

  return (
    <input
      type="number"
      placeholder="2"
      className="input bg-gray-100 px-2 py-2 rounded-md custom-input w-12 "
      value={number}
      onChange={handleChange}
    />
  );
};

export default NumberInput;
