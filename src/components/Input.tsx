import React from "react";

type InputProps = {
  type?: string; // default type is text
  placeholder?: string; // default placeholder is empty string
  value?: string | number | readonly string[] | undefined; // value can be string or number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange handler
  className?: string; // optional custom className
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", placeholder = "", value, onChange, className = "", ...props }, ref) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={ref} // attach the forwarded ref
        className={`input bg-gray-100 px-2 py-2 rounded-md ${className}`}
        {...props} // spread additional props
      />
    );
  }
);

export default Input;
