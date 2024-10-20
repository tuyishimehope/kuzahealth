import { ReactNode } from "react";

interface ButtonProps {
  name: string;
  className: string;
  onClick?: (() => void) | undefined | void;
  icon?: ReactNode | string; 
}

const Button: React.FC<ButtonProps> = ({ name, className, onClick = () => { }, icon }) => {
  return (
    <button className={className} onClick={onClick}>
      <div className="flex space-x-4 items-center justify-center">
        <span>{name}</span>
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
