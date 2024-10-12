
interface buttonProps {
    name:string,
    className:string
}
const Button = ({name,className}:buttonProps) => {
  return (
    <button className={className}>{name}</button>
  )
}

export default Button