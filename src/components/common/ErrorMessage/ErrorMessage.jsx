import PropTypes from "prop-types";
import "./ErrorMessage.css";

function ErrorMessage({
    message = "Something went wrong.",
    title = "Error",
    onRetry,
    retryText = "Try Again",
    className = ""
}) {
    const errorClasses = [
        "error-message",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={errorClasses}
            role="alert"
        >
            <div
                className="error-message__icon"
                aria-hidden="true"
            >
                !
            </div>

            <div className="error-message__content">
                {title && (
                    <h3 className="error-message__title">
                        {title}
                    </h3>
                )}

                <p className="error-message__text">
                    {message}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        className="error-message__retry"
                        onClick={onRetry}
                    >
                        {retryText}
                    </button>
                )}
            </div>
        </div>
    );
}

ErrorMessage.propTypes = {
    message: PropTypes.string,

    title: PropTypes.string,

    onRetry: PropTypes.func,

    retryText: PropTypes.string,

    className: PropTypes.string
};

export default ErrorMessage;