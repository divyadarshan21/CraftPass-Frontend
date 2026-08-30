import PropTypes from "prop-types";
import "./Select.css";

function Select({
    id,
    label,
    name,
    value,
    defaultValue,
    onChange,
    onBlur,
    options = [],
    placeholder = "Select an option",
    error = "",
    helperText = "",
    required = false,
    disabled = false,
    className = "",
    ...props
}) {
    const selectClasses = [
        "select",
        error ? "select--error" : "",
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
        <div className="select-field">
            {label && (
                <label
                    htmlFor={id}
                    className="select-field__label"
                >
                    {label}

                    {required && (
                        <span
                            className="select-field__required"
                            aria-hidden="true"
                        >
                            *
                        </span>
                    )}
                </label>
            )}

            <div className="select-field__wrapper">
                <select
                    id={id}
                    name={name}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={selectClasses}
                    required={required}
                    disabled={disabled}
                    aria-invalid={Boolean(error)}
                    aria-describedby={messageId}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <span
                    className="select-field__arrow"
                    aria-hidden="true"
                >
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>

            {error && (
                <p
                    id={`${id}-error`}
                    className="select-field__message select-field__message--error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p
                    id={`${id}-helper`}
                    className="select-field__message"
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}

Select.propTypes = {
    id: PropTypes.string.isRequired,

    label: PropTypes.string,

    name: PropTypes.string,

    value: PropTypes.string,

    defaultValue: PropTypes.string,

    onChange: PropTypes.func,

    onBlur: PropTypes.func,

    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            disabled: PropTypes.bool
        })
    ),

    placeholder: PropTypes.string,

    error: PropTypes.string,

    helperText: PropTypes.string,

    required: PropTypes.bool,

    disabled: PropTypes.bool,

    className: PropTypes.string
};

export default Select;