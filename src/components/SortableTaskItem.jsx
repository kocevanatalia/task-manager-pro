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

  const isEditingTask = editingId === t.id;
  const isEditingTaskNote = editingNoteId === t.id;

  return (
    <li ref={setNodeRef} style={style} className="task-item">
      <div className="task-main">
        <div className="left">
          <span
            {...attributes}
            {...listeners}
            className="drag-handle"
            title="Drag task"
          >
            ☰
          </span>

          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => toggleComplete(t.id)}
          />

          <div className="task-content">
            {isEditingTask ? (
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
              <>
                <span className={t.completed ? 'completed task-title' : 'task-title'}>
                  {t.text}
                </span>

                {t.priority && (
                  <div>
                    <span className={`priority-badge ${t.priority}`}>
                      {t.priority}
                    </span>
                  </div>
                )}

                {t.dueDate && (
                  <p className={isOverdue(t) ? 'due-date overdue' : 'due-date'}>
                    Due: {t.dueDate}
                    {isOverdue(t) && ' • Overdue'}
                  </p>
                )}

                {!isEditingTaskNote && t.note && (
                  <p className="note">{t.note}</p>
                )}

                {isEditingTaskNote && (
                  <div className="note-editor">
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Write a note..."
                    />
                    <div className="note-actions">
                      <button className="action primary" onClick={saveNote}>
                        Save
                      </button>
                      <button className="action" onClick={cancelNote}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="task-side">
          {isEditingTask ? (
            <div className="task-actions">
              <button className="action primary" onClick={saveEdit}>
                Save
              </button>
              <button className="action" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                className="note-link"
                onClick={() => startEditingNote(t.id, t.note)}
              >
                {t.note ? 'Edit note' : 'Add note'}
              </button>

              <div className="task-actions">
                <button
                  className="action"
                  onClick={() => startEditing(t.id, t.text, t.dueDate, t.priority)}
                >
                  Edit
                </button>
                <button
                  className="action danger-soft"
                  onClick={() => handleDelete(t.id)}
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}