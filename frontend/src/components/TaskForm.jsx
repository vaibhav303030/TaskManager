import { useState, useEffect } from 'react'

const initialState = {
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
}

function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // When the user clicks "Edit" on a task, fill the form with its data
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'Pending',
        priority: editingTask.priority || 'Medium',
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      })
    } else {
      setFormData(initialState)
    }
    setErrors({})
  }, [editingTask])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Simple, readable validation rules
  const validate = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (formData.description.length > 300) {
      newErrors.description = 'Description must be under 300 characters'
    }

    if (formData.dueDate) {
      const chosenDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (chosenDate < today && !editingTask) {
        newErrors.dueDate = 'Due date cannot be in the past'
      }
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(formData)
      if (!editingTask) {
        setFormData(initialState)
      }
      setErrors({})
    } catch (err) {
      setErrors({ form: err.message || 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Add a New Task'}</h2>

      {errors.form && <p className="field-error form-level-error">{errors.form}</p>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Finish project report"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional details about this task"
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
