function StatCard({ icon: Icon, value, title, description }) {
    return (
        <div className="stat-card">
            <div className="stat-card-icon">
                <Icon size={25} strokeWidth={2} />
            </div>

            <div className="stat-card-content">
                <strong>{value}</strong>

                <span>{title}</span>

                {description && (
                    <small>{description}</small>
                )}
            </div>
        </div>
    );
}

export default StatCard;