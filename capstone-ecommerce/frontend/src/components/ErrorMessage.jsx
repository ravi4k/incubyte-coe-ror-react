export default function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">
        Try Again
      </button>
    </div>
  );
}
