'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*')
    setTasks(data || [])
  }

  const addTask = async () => {
    if (!title) return

    await supabase.from('tasks').insert([{ title }])
    setTitle('')
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Add Task */}
      <div className="mb-4 flex gap-2">
        <input
          className="border p-2 flex-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />

        <button
          onClick={addTask}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            className="border p-2 mb-2 flex justify-between items-center rounded"
          >
            <span>{task.title}</span>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )
}