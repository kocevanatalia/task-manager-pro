import { useState, useEffect } from 'react';

function App() {
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

        {/* TASK LIST*/}
        {tasks.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#999' }}>
            No tasks yet. Add one above 👆
          </p>
        ) : (
          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0}}>
            {tasks.map((t,index) => (
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