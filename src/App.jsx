import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableTaskItem from './components/SortableTaskItem';
import TaskInput from './components/TaskInput';
import Stats from './components/Stats';
import Filters from './components/Filters';

function App() {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
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
  const [priority, setPriority] = useState('medium');

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      note: '',
      dueDate,
      priority,
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setDueDate('');
    setPriority('medium');
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

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const startEditing = (id, currentText, currentDueDate, currentPriority) => {
    setEditingId(id);
    setEditText(currentText);
    setEditDueDate(currentDueDate || '');
    setEditPriority(currentPriority || 'medium');
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;

    const updatedTasks = tasks.map((t) =>
      t.id === editingId
        ? {
            ...t,
            text: editText,
            dueDate: editDueDate,
            priority: editPriority,
          }
        : t
    );

    setTasks(updatedTasks);
    setEditingId(null);
    setEditText('');
    setEditDueDate('');
    setEditPriority('medium');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditDueDate('');
    setEditPriority('medium');
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
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.dueDate);
    return taskDate < today;
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
    const newIndex = filteredTasks.findIndex((task) => task.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedFiltered = arrayMove(filteredTasks, oldIndex, newIndex);

    const remainingTasks = tasks.filter(
      (task) => !filteredTasks.some((ft) => ft.id === task.id)
    );

    setTasks([...remainingTasks, ...reorderedFiltered]);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const overdueTasks = tasks.filter((t) => isOverdue(t)).length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <div className="container">
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>

        <div className="hero">
          <h1>Tasks</h1>
          <p className="subtitle">A quiet space to keep things in order.</p>
        </div>

        <TaskInput
          task={task}
          setTask={setTask}
          dueDate={dueDate}
          setDueDate={setDueDate}
          priority={priority}
          setPriority={setPriority}
          handleAddTask={handleAddTask}
        />

        <Stats
          totalTasks={totalTasks}
          activeTasks={activeTasks}
          completedTasks={completedTasks}
          overdueTasks={overdueTasks}
          progress={progress}
        />

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

        <Filters filter={filter} setFilter={setFilter} />

        {tasks.some((t) => t.completed) && (
          <button className="clear-link" onClick={clearCompleted}>
            Clear completed
          </button>
        )}

        {filteredTasks.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#999' }}>
            No tasks found 👆
          </p>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
                {filteredTasks.map((t) => (
                  <SortableTaskItem
                    key={t.id}
                    t={t}
                    editingId={editingId}
                    editText={editText}
                    setEditText={setEditText}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                    toggleComplete={toggleComplete}
                    startEditing={startEditing}
                    handleDelete={handleDelete}
                    editingNoteId={editingNoteId}
                    editNote={editNote}
                    setEditNote={setEditNote}
                    saveNote={saveNote}
                    cancelNote={cancelNote}
                    startEditingNote={startEditingNote}
                    isOverdue={isOverdue}
                    editDueDate={editDueDate}
                    setEditDueDate={setEditDueDate}
                    editPriority={editPriority}
                    setEditPriority={setEditPriority}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default App;