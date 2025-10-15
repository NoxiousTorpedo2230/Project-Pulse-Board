import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LabelModal({ profile }){
  const [open, setOpen] = useState(false)
  const [labels, setLabels] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(()=>{
    async function load(){
      const { data } = await supabase.from('labels').select('*').order('name')
      setLabels(data || [])
    }
    load()
  }, [])

  async function create(){
    if (!name.trim()) return
    const { data, error } = await supabase.from('labels').insert([{ name }]).select().single()
    if (error) return alert(error.message)
    setLabels(prev=>[...prev, data])
    setName('')
  }

  async function rename(label){
    if (!profile || profile.role !== 'admin') return alert('Only admins can rename')
    if (!editName.trim()) return
    try{
      const { data, error } = await supabase.from('labels').update({ name: editName }).eq('id', label.id).select().single()
      if (error) throw error
      setLabels(prev => prev.map(l => l.id === label.id ? data : l))
      setEditing(null)
      setEditName('')
    }catch(e){ console.error(e); alert('Failed to rename') }
  }

  if (!open) return <button onClick={()=>setOpen(true)} className="ml-3 border px-3 py-1 rounded">Manage labels</button>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-semibold mb-3">Labels</h3>
        <div className="space-y-2 max-h-48 overflow-auto mb-3">
          {labels.map(l=> (
            <div key={l.id} className="flex items-center justify-between border rounded px-3 py-2">
              {editing === l.id ? (
                <>
                  <input value={editName} onChange={e=>setEditName(e.target.value)} className="flex-1 border rounded px-2 py-1 mr-2" />
                  <button onClick={()=>rename(l)} className="text-sm bg-blue-600 text-white px-2 py-1 rounded">Save</button>
                </>
              ) : (
                <>
                  <div>{l.name}</div>
                  <div className="flex gap-2">
                    <button onClick={()=>{ if (profile && profile.role === 'admin'){ setEditing(l.id); setEditName(l.name) } else alert('Only admins can rename') }} className="text-sm text-blue-600">Rename</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="New label" className="flex-1 border px-3 py-2 rounded" />
          <button onClick={create} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={()=>setOpen(false)} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
