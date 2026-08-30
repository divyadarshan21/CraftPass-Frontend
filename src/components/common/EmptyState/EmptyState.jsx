import PropTypes from "prop-types";
import "./EmptyState.css";

function EmptyState({
    title = "Nothing here yet",
    message = "",
    action,
    icon,
    className = ""
}) {
    const emptyStateClasses = [
        "empty-state",
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={emptyStateClasses}>
            {icon && (
                <div
                    className="empty-state__icon"
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}

            <div className="empty-state__content">
                <h3 className="empty-state__title">
                    {title}
                </h3>

                {message && (
                    <p className="empty-state__message">
                        {message}
                    </p>
                )}

                {action && (
                    <div className="empty-state__action">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string,

    message: PropTypes.string,

    action: PropTypes.node,

    icon: PropTypes.node,

    className: PropTypes.string
};

export default EmptyState;