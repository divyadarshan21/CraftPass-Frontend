import { useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "medium",
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true
}) {
    useEffect(() => {
        if (!isOpen || !closeOnEscape) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeOnEscape, onClose]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (event) => {
        if (
            closeOnOverlayClick &&
            event.target === event.currentTarget
        ) {
            onClose();
        }
    };

    return (
        <div
            className="modal"
            role="presentation"
            onMouseDown={handleOverlayClick}
        >
            <div
                className={`modal__content modal__content--${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal__header">
                    <h2
                        id="modal-title"
                        className="modal__title"
                    >
                        {title}
                    </h2>

                    {showCloseButton && (
                        <button
                            type="button"
                            className="modal__close"
                            onClick={onClose}
                            aria-label="Close modal"
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

                <div className="modal__body">
                    {children}
                </div>

                {footer && (
                    <div className="modal__footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,

    onClose: PropTypes.func.isRequired,

    title: PropTypes.string.isRequired,

    children: PropTypes.node.isRequired,

    footer: PropTypes.node,

    size: PropTypes.oneOf([
        "small",
        "medium",
        "large"
    ]),

    closeOnOverlayClick: PropTypes.bool,

    closeOnEscape: PropTypes.bool,

    showCloseButton: PropTypes.bool
};

export default Modal;