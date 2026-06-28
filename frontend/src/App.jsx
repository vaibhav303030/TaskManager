import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

// Base URL of the backend API - comes from .env, falls back to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  // Load tasks once when the app first mounts
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Server responded with an error')
      const data = await res.json()
      setTasks(data)
      setError('')
    } catch (err) {
      setError('Could not load tasks. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }

  // Create a new task - called by TaskForm
  const addTask = async (taskData) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to create task')

    // Update UI instantly, no page refresh needed
    setTasks((prev) => [data, ...prev])
  }

  // Update an existing task - called by TaskForm when editing
  const updateTask = async (id, taskData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update task')

    setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)))
    setEditingTask(null)
  }

  // Delete a task
  const deleteTask = async (id) => {
    const confirmed = window.confirm('Delete this task? This cannot be undone.')
    if (!confirmed) return

    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t._id !== id))
    }
  }

  // Quick way to cycle a task's status by clicking its status pill
  const cycleStatus = async (task) => {
    const order = ['Pending', 'In Progress', 'Completed']
    const next = order[(order.indexOf(task.status) + 1) % order.length]
    try {
      await updateTask(task._id, { ...task, status: next })
    } catch {
      // ignore - keeps UI simple
    }
  }

  const visibleTasks = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Tracker</h1>
        <p>A simple MERN-stack app to manage your to-dos</p>
      </header>

      <main className="app-main">
        <TaskForm
          onSubmit={editingTask ? (data) => updateTask(editingTask._id, data) : addTask}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section className="task-section">
          <div className="task-section-header">
            <h2>Your Tasks ({visibleTasks.length})</h2>
            <div className="filter-buttons">
              {['All', 'Pending', 'In Progress', 'Completed'].map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-banner">{error}</p>}

          {loading ? (
            <p className="loading-text">Loading tasks...</p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              onEdit={setEditingTask}
              onDelete={deleteTask}
              onToggleStatus={cycleStatus}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
