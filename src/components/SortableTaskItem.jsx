import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableTaskItem({
  t,
  editingId,
  editText,
  setEditText,
  saveEdit,
  cancelEdit,
  toggleComplete,
  startEditing,
  handleDelete,
  editingNoteId,
  editNote,
  setEditNote,
  saveNote,
  cancelNote,
  startEditingNote,
  isOverdue,
  editDueDate,
  setEditDueDate,
  editPriority,
  setEditPriority,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="task-item">
      <div className="left">
        <span
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', marginRight: '10px' }}
        >
          ☰
        </span>

        <input
          type="checkbox"
          checked={t.completed}
          onChange={() => toggleComplete(t.id)}
        />

        {editingId === t.id ? (
          <div className="edit-fields">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              autoFocus
            />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        ) : (
          <div>
            <span className={t.completed ? 'completed' : ''}>{t.text}</span>

            {t.priority && (
              <div>
                <span className={`priority-badge ${t.priority}`}>
                  {t.priority}
                </span>
              </div>
            )}

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
            <button
              onClick={() => startEditing(t.id, t.text, t.dueDate, t.priority)}
            >
              ✏️
            </button>
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
  );
}