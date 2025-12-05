import './styles.css';

function DashboardCard({ title, value, icon, color }) {
  return (
    <div className="dashboard-card" style={{ borderLeftColor: color }}>
      <div className="card-content">
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
      </div>
      <div className="card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
    </div>
  );
}

export default DashboardCard;