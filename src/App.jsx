import { useState, useEffect } from 'react';

function App() {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

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
  const [dueDate, setDueDate] = useState('');

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const handleAddTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      note: '',
      dueDate: dueDate,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setDueDate('');
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
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
    setTasks(tasks.filter((t) => !t.completed));
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;

    const updatedTasks = tasks.map((t) =>
      t.id === editingId ? { ...t, text: editText } : t
    );

    setTasks(updatedTasks);
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const startEditingNote = (id, currentNote) => {
    setEditingNoteId(id);
    setEditNote(currentNote || '');
  };

  const saveNote = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === editingNoteId ? { ...t, note: editNote } : t
    );

    setTasks(updatedTasks);
    setEditingNoteId(null);
    setEditNote('');
  };

  const cancelNote = () => {
    setEditingNoteId(null);
    setEditNote('');
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;

    const today = new Date();
    today.setHours(0,0,0,0);

    const taskDate = new Date(task.dueDate);
    return taskDate < today;
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
            }}
          />

          <input 
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
            {filteredTasks.map((t) => (
              <li key={t.id} className="task-item">

                <div className="left">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t.id)}
                  />

                  {editingId === t.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <div>
                      <span className={t.completed ? 'completed' : ''}>
                        {t.text}
                      </span>
                      {t.dueDate && (
                        <p className={isOverdue(t) ? 'due-date overdue' : 'due-date'}> 
                          Due: {t.dueDate} {isOverdue(t) && '• Overdue'}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {editingId === t.id ? (
                    <>
                      <button onClick={saveEdit}>💾</button>
                      <button onClick={cancelEdit}>❌</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(t.id, t.text)}>✏️</button>
                      <button onClick={() => handleDelete(t.id)}>🗑</button>
                    </>
                  )}
                </div>

                <div className="note-section">
                  {editingNoteId === t.id ? (
                    <>
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Add a note..."
                      />
                      <button onClick={saveNote}>💾</button>
                      <button onClick={cancelNote}>❌</button>
                    </>
                  ) : (
                    <>
                      {t.note && <p className="note">{t.note}</p>}
                      <button onClick={() => startEditingNote(t.id, t.note)}>
                        📝 Note
                      </button>
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