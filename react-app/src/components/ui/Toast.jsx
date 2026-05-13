export default function Toast({ message }) {
  return (
    <div className={`toast-notification${message ? ' show' : ''}`}>
      {message}
    </div>
  )
}
