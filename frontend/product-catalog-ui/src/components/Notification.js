import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    const alertClass = type === 'success'
        ? 'alert-success'
        : type === 'error'
            ? 'alert-danger'
            : 'alert-info';

    return (
        <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
            {message}
            <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
            ></button>
        </div>
    );
};

export default Notification;