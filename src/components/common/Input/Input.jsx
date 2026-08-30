import PropTypes from "prop-types";
import "./Input.css";

function Input({
    id,
    label,
    name,
    type = "text",
    placeholder = "",
    value,
    defaultValue,
    onChange,
    onBlur,
    error = "",
    helperText = "",
    required = false,
    disabled = false,
    readOnly = false,
    autoComplete,
    className = "",
    ...props
}) {
    const inputClasses = [
        "input",
        error ? "input--error" : "",
        className
    ]
        .filter(Boolean)
        .join(" ");

    const messageId = error
        ? `${id}-error`
        : helperText
            ? `${id}-helper`
            : undefined;

    return (
        <div className="input-field">
            {label && (
                <label
                    htmlFor={id}
                    className="input-field__label"
                >
                    {label}

                    {required && (
                        <span
                            className="input-field__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}

            <input
                id={id}
                name={name}
                type={type}
                className={inputClasses}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                aria-invalid={Boolean(error)}
                aria-describedby={messageId}
                {...props}
            />

            {error && (
                <p
                    id={`${id}-error`}
                    className="input-field__message input-field__message--error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p
                    id={`${id}-helper`}
                    className="input-field__message"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}

Input.propTypes = {
    id: PropTypes.string.isRequired,

    label: PropTypes.string,

    name: PropTypes.string,

    type: PropTypes.string,

    placeholder: PropTypes.string,

    value: PropTypes.string,

    defaultValue: PropTypes.string,

    onChange: PropTypes.func,

    onBlur: PropTypes.func,

    error: PropTypes.string,

    helperText: PropTypes.string,

    required: PropTypes.bool,

    disabled: PropTypes.bool,

    readOnly: PropTypes.bool,

    autoComplete: PropTypes.string,

    className: PropTypes.string
};

export default Input;