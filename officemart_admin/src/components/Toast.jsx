import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast" data-testid="toast" role="status">
      {message}
    </div>
  );
}
