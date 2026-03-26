export default function Stats({
  totalTasks,
  activeTasks,
  completedTasks,
  overdueTasks,
  progress,
}) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total</h3>
        <p>{totalTasks}</p>
      </div>

      <div className="stat-card">
        <h3>Active</h3>
        <p>{activeTasks}</p>
      </div>

      <div className="stat-card">
        <h3>Completed</h3>
        <p>{completedTasks}</p>
      </div>

      <div className="stat-card">
        <h3>Overdue</h3>
        <p>{overdueTasks}</p>
      </div>

      <div className="stat-card">
        <h3>Progress</h3>
        <p>{progress}%</p>
      </div>
    </div>
  );
}