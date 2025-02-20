import { ReactNode } from "react";

interface ButtonProps {
  name: ReactNode; // Change from `string` to `ReactNode`
  className: string;
  onClick?: (() => void) | undefined | void;
  icon?: ReactNode | string;
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ name, className, onClick = () => { }, icon,disabled }) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      <div className="flex space-x-4 items-center justify-center">
        <span>{name}</span> {/* Now supports JSX elements */}
        {icon &&
          (typeof icon === "string" ? (
            <img src={icon} alt="icon" className="w-6 object-cover" />
          ) : (
            <>{icon}</>
          ))
        }
      </div>
    </button>
  );
};

export default Button;
