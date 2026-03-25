import { useState, useEffect } from 'react';

function App() {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
    const updatedTasks = tasks.map((t, i) => {
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

  const startEditing = (index, currentText) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;

    const updatedTasks = tasks.map((t, i) => {
      if (i === editingIndex) {
        return { ...t, text: editText };
      }
      return t;
    });

    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <div className="container">

        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

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

        <p style={{ marginTop: '16px', color: '#666' }}>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>

        <input
          className="search-input"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filters">
          <button
            className={filter === 'all' ? 'active-filter' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'active' ? 'active-filter' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>

          <button
            className={filter === 'completed' ? 'active-filter' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {tasks.some((t) => t.completed) && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        )}

        {tasks.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#999' }}>
            No tasks yet. Add one above 👆
          </p>
        ) : (
          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
            {filteredTasks.map((t, index) => (
              <li key={index} className="task-item">

                <div className="left">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(index)}
                  />

                  {editingIndex === index ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className={t.completed ? 'completed' : ''}>
                      {t.text}
                    </span>
                  )}
                </div>

                <div>
                  {editingIndex === index ? (
                    <>
                      <button onClick={saveEdit}>💾</button>
                      <button onClick={cancelEdit}>❌</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(index, t.text)}>✏️</button>
                      <button onClick={() => handleDelete(index)}>🗑</button>
                    </>
                  )}
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;