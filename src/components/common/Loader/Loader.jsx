import PropTypes from "prop-types";
import "./Loader.css";

function Loader({
    size = "medium",
    message = "",
    fullScreen = false
}) {
    const loaderClasses = [
        "loader",
        `loader--${size}`,
        fullScreen ? "loader--fullscreen" : ""
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            className={loaderClasses}
            role="status"
            aria-live="polite"
            aria-label={message || "Loading"}
        >
            <span
                className="loader__spinner"
                aria-hidden="true"
            />

            {message && (
                <span className="loader__message">
                    {message}
                </span>
            )}
        </div>
    );
}

Loader.propTypes = {
    size: PropTypes.oneOf([
        "small",
        "medium",
        "large"
    ]),

    message: PropTypes.string,

    fullScreen: PropTypes.bool
};

export default Loader;