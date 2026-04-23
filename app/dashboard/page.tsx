'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

type Score = {
  id: number
  score: number
  date: string
}

export default function Dashboard() {
  const [scores, setScores] = useState<Score[]>([])
  const [score, setScore] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchScores()
  }, [])

  async function fetchScores() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('date', { ascending: false })

    setScores(data || [])
  }

  const addScore = async () => {
    const value = Number(score)

    if (!value || value < 1 || value > 45) {
      alert('Score must be between 1 and 45')
      return
    }

    // keep only latest 5 scores
    if (scores.length >= 5) {
      const oldest = scores[scores.length - 1]
      await supabase.from('tasks').delete().eq('id', oldest.id)
    }

    await supabase.from('tasks').insert([
      {
        score: value,
        date: new Date().toISOString().split('T')[0],
      },
    ])

    setScore('')
    fetchScores()
  }

  const deleteScore = async (id: number) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchScores()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <button
        onClick={handleLogout}
        className="mb-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold mb-4">Score Dashboard</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="number"
          className="border p-2 flex-1"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score (1–45)"
        />

        <button
          onClick={addScore}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {scores.length === 0 ? (
        <p>No scores yet</p>
      ) : (
        scores.map((s) => (
          <div
            key={s.id}
            className="border p-2 mb-2 flex justify-between rounded"
          >
            <span>
              Score: {s.score} | Date: {s.date}
            </span>

            <button
              onClick={() => deleteScore(s.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )
}