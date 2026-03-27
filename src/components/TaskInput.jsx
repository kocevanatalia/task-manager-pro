export default function TaskInput({
  task,
  setTask,
  dueDate,
  setDueDate,
  priority,
  setPriority,
  handleAddTask,
}) {
  return (
    <div className="task-input-section">
      <input
        type="text"
        placeholder="Enter a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAddTask();
        }}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={handleAddTask}>Add</button>
    </div>
  );
}