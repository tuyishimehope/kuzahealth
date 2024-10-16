type inputProps = {
  type?: string; // default type is text
  placeholder?: string; // default placeholder is empty string
  value?: string | number | readonly string[] | undefined; // value can be string or number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // onChange handler takes an event
  className?: string | undefined | null; // default className is empty string
};


const Input:React.FC<inputProps> = ({
  type , // default type is text
  placeholder = '', // default placeholder is empty string
  value = '', // default value is empty string
  onChange = () => {}, // default onChange handler is a no-op
  className = '', // default className is empty string
  ...props // allow additional props to be passed
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input bg-gray-100 px-2 py-2 rounded-md  ${className}`} // add a default class and allow custom classes
      {...props} // spread additional props
    />
  );
};

export default Input;