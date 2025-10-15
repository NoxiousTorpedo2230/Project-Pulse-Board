import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function CommentSection({ ticketId, supabase: supabaseProp }){
  const client = supabaseProp || supabase
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const { data } = await client.from('comments').select('id, body, created_at, author_id').eq('ticket_id', ticketId).order('created_at', { ascending: true })
      setComments(data || [])
      setLoading(false)
    }
    if (ticketId) load()
  }, [ticketId])

  async function post(){
    if (!newComment.trim()) return
    const user = await client.auth.getUser().then(r=>r.data.user)
    if (!user) return alert('You must be signed in to comment')
    const payload = { ticket_id: ticketId, author_id: user.id, body: newComment }
    const optimistic = { id: `optim-${Date.now()}`, body: newComment, created_at: new Date().toISOString(), author_id: user.id }
    setComments(prev=>[...prev, optimistic])
    setNewComment('')
    try{
      const { data, error } = await client.from('comments').insert([payload]).select().single()
      if (error) throw error
      setComments(prev => prev.map(c => c.id === optimistic.id ? data : c))
    }catch(err){
      console.error(err)
      alert('Failed to post comment')
      setComments(prev => prev.filter(c => c.id !== optimistic.id))
    }
  }

  return (
    <div>
      <h4 className="font-semibold mb-3">Comments</h4>
      {loading ? <div className="text-gray-500">Loading comments...</div> : (
        <div className="space-y-3">
          {comments.map(c=> (
            <div key={c.id} className="border p-3 rounded">
              <div className="text-gray-800 mb-1">{c.body}</div>
              <div className="text-sm text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 border px-3 py-2 rounded" />
        <button onClick={post} className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
      </div>
    </div>
  )
}
