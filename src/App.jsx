import { useState, useEffect } from 'react';

function App() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const handleAddTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask('');
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((t,i) => {
      if (i === index) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
  })
  .filter((t) => 
  t.text.toLowerCase().includes(search.toLowerCase())
  );

  const clearCompleted = () => {
    const activeTasks = tasks.filter((t) => !t.completed);
    setTasks(activeTasks);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Task Manager Pro</h1>
        <p className="subtitle">My improved React task manager</p>

        <div className="task-input-section">
          <input 
          type="text" 
          placeholder="Enter a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>

        {/* TASK COUNTER */}
        <p style={{marginTop: '16px', color: '#666' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginTop: '20px', width: '100%', padding: '10px'}}
        />

        {/* FILTERS*/}
        <div className="filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('active')}>Active</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
        </div>

        {tasks.some((t) => t.completed) && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        )}

        {/* TASK LIST*/}
        {tasks.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#999' }}>
            No tasks yet. Add one above 👆
          </p>
        ) : (
          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0}}>
            {filteredTasks.map((t,index) => (
              <li key={index} className="task-item">

                <div className="left">
                  <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleComplete(index)}
                  />

                  <span className={t.completed ? 'completed' : ''}>
                    {t.text}
                  </span>
                </div>

                <button onClick={() => handleDelete(index)}>❌</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;