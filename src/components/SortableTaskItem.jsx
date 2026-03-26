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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: t.id });

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

      <div className="task-actions">
        {editingId === t.id ? (
          <>
            <button className="text-btn save-btn" onClick={saveEdit}>
                Save
            </button>
            <button className="text-btn subtle-btn" onClick={cancelEdit}>
                Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="text-btn"
              onClick={() =>
                startEditing(t.id, t.text, t.dueDate, t.priority)
              }
            >
              Edit
            </button>
            <button onClick={() => handleDelete(t.id)}>
                Delete
            </button>
          </>
        )}
      </div>

      <div className="note-section">
        {editingNoteId === t.id ? (
          <>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Write a note..."
            />
            <div className="note-actions">
                <button className="text-btn save-btn" onClick={saveNote}>
                    Save
                </button>
                <button className="text-btn subtle-btn" onClick={cancelNote}>
                    Cancel
                </button>
            </div>
          </>
        ) : (
          <>
            {t.note && <p className="note">{t.note}</p>}
            <button 
                className="note-btn"
                onClick={() => startEditingNote(t.id, t.note)}>
              {t.note ? 'Edit note' : 'Add note'}
            </button>
          </>
        )}
      </div>
    </li>
  );
}