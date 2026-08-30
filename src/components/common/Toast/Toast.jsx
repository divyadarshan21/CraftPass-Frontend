import { useEffect } from "react";
import PropTypes from "prop-types";
import "./Toast.css";

function Toast({
    message,
    type = "success",
    isVisible = true,
    duration = 4000,
    onClose,
    position = "top-right"
}) {
    useEffect(() => {
        if (!isVisible || !duration || !onClose) {
            return undefined;
        }

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [isVisible, duration, onClose]);

    if (!isVisible || !message) {
        return null;
    }

    return (
        <div
            className={`toast toast--${type} toast--${position}`}
            role={type === "error" ? "alert" : "status"}
            aria-live={type === "error" ? "assertive" : "polite"}
        >
            <div className="toast__icon" aria-hidden="true">
                {type === "success" && "✓"}
                {type === "error" && "!"}
                {type === "warning" && "!"}
                {type === "info" && "i"}
            </div>

            <p className="toast__message">
                {message}
            </p>

            {onClose && (
                <button
                    type="button"
                    className="toast__close"
                    onClick={onClose}
                    aria-label="Close notification"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 6L18 18M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}

Toast.propTypes = {
    message: PropTypes.string.isRequired,

    type: PropTypes.oneOf([
        "success",
        "error",
        "warning",
        "info"
    ]),

    isVisible: PropTypes.bool,

    duration: PropTypes.number,

    onClose: PropTypes.func,

    position: PropTypes.oneOf([
        "top-right",
        "top-left",
        "bottom-right",
        "bottom-left"
    ])
};

export default Toast;