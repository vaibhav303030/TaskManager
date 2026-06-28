import TaskItem from './TaskItem'

function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks here yet.</p>
        <span>Add a task above to get started.</span>
      </div>
    )
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  )
}

export default TaskList
