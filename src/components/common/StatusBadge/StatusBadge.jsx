import PropTypes from "prop-types";
import "./StatusBadge.css";

const STATUS_CONFIG = {
    verified: {
        label: "Verified",
        icon: "✓"
    },
    pending: {
        label: "Pending",
        icon: "•"
    },
    rejected: {
        label: "Rejected",
        icon: "!"
    }
};

function StatusBadge({
    status,
    label,
    showIcon = true,
    size = "medium",
    className = ""
}) {
    const normalizedStatus = status.toLowerCase();

    const config = STATUS_CONFIG[normalizedStatus];

    if (!config) {
        return null;
    }

    const badgeClasses = [
        "status-badge",
        `status-badge--${normalizedStatus}`,
        `status-badge--${size}`,
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={badgeClasses}>
            {showIcon && (
                <span
                    className="status-badge__icon"
                    aria-hidden="true"
                >
                    {config.icon}
                </span>
            )}

            <span className="status-badge__label">
                {label || config.label}
            </span>
        </span>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.oneOf([
        "verified",
        "pending",
        "rejected"
    ]).isRequired,

    label: PropTypes.string,

    showIcon: PropTypes.bool,

    size: PropTypes.oneOf([
        "small",
        "medium"
    ]),

    className: PropTypes.string
};

export default StatusBadge;