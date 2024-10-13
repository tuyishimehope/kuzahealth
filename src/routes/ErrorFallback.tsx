

interface fallbackProps{
    error:{message:string}
}

const ErrorFallback = ({ error }:fallbackProps) => {
  return (
    <div>
      <h1>Oops, something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
};

export default ErrorFallback;