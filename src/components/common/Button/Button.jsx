import PropTypes from "prop-types";
import "./Button.css";

function Button({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = "",
    ...props
}) {
    const buttonClasses = [
        "button",
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? "button--full-width" : "",
        loading ? "button--loading" : "",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            aria-busy={loading}
            {...props}
        >
            {loading ? (
                <span className="button__content">
                    <span
                        className="button__spinner"
                        aria-hidden="true"
                    />
                    <span>Loading...</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,

    type: PropTypes.oneOf([
        "button",
        "submit",
        "reset"
    ]),

    variant: PropTypes.oneOf([
        "primary",
        "secondary",
        "outline",
        "ghost",
        "danger"
    ]),

    size: PropTypes.oneOf([
        "small",
        "medium",
        "large"
    ]),

    loading: PropTypes.bool,

    disabled: PropTypes.bool,

    fullWidth: PropTypes.bool,

    onClick: PropTypes.func,

    className: PropTypes.string
};

export default Button;