import React, { useEffect, useState } from 'react';
import '../styles/Notification.css';  // Add custom styles for the notification

const Notification = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false); // Hide notification after 3 seconds
      onClose();  // Optionally call onClose to clean up the message
    }, 3000); // 3 seconds duration for the message

    return () => clearTimeout(timer);  // Cleanup on unmount
  }, [onClose]);

  if (!visible) return null;  // Don't render if not visible

  return (
    <div className="notification">
      <p>{message}</p>
    </div>
  );
};

export default Notification;
