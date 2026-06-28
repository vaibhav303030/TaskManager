function formatDate(dateString) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const statusSlug = task.status.toLowerCase().replace(' ', '-')
  const prioritySlug = task.priority.toLowerCase()

  return (
    <div className={`task-card priority-border-${prioritySlug}`}>
      <div className="task-card-top">
        <h3>{task.title}</h3>
        <span className={`priority-tag priority-${prioritySlug}`}>{task.priority}</span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-bottom">
        <button
          className={`status-pill status-${statusSlug}`}
          onClick={() => onToggleStatus(task)}
          title="Click to change status"
        >
          {task.status}
        </button>

        {task.dueDate && <span className="due-date">Due {formatDate(task.dueDate)}</span>}
      </div>

      <div className="task-actions">
        <button className="btn btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskItem
