import React, {useState, useEffect} from 'react'

export default function TaskCounterReact() {
    const [stats, setStats] = useState({total: 0, todo: 0, in_progress: 0, done: 0})
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/v1/tasks')
            const data = await response.json()
            setTasks(data.tasks)
            setStats(data.stats)
            setLoading(false)
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
            setLoading(false)
        }
    }

    const updateTaskStatus = async (taskId, currentStatus) => {
        const nextStatus = {
            'todo': 'in_progress',
            'in_progress': 'done',
            'done': 'todo'
        }[currentStatus]

        try {
            await fetch(`/api/v1/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({task: {status: nextStatus}})
            })
            fetchTasks()
        } catch (error) {
            console.error('Failed to update task:', error)
        }
    }

    const deleteTask = async (taskId) => {
        try {
            await fetch(`/api/v1/tasks/${taskId}`, {method: 'DELETE'})
            fetchTasks()
        } catch (error) {
            console.error('Failed to delete task:', error)
        }
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return task.status !== 'done'
        if (filter === 'completed') return task.status === 'done'
        return true
    })

    if (loading) {
        return <div className="p-6">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">My Tasks (React Version)</h1>

            {/* Counter */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Task Overview</h2>

                <div className="flex justify-around mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-600">{stats.todo}</div>
                        <div className="text-sm text-gray-600">Todo</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{stats.in_progress}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{stats.done}</div>
                        <div className="text-sm text-gray-600">Done</div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded ${
                            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        All Tasks
                    </button>

                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-2 rounded ${
                            filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        Active Only
                    </button>

                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded ${
                            filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        Completed Only
                    </button>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {filteredTasks.map(task => (
                    <div key={task.id} className="bg-white rounded shadow p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => updateTaskStatus(task.id, task.status)}
                                className="cursor-pointer text-left"
                            >
                                {task.status === 'todo' && <span className="text-gray-600">☐ Todo</span>}
                                {task.status === 'in_progress' && <span className="text-blue-600">🔄 In Progress</span>}
                                {task.status === 'done' && <span className="text-green-600">✓ Done</span>}
                            </button>

                            <span className={task.status === 'done' ? 'line-through text-gray-400' : ''}>
                {task.content}
              </span>
                        </div>

                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}