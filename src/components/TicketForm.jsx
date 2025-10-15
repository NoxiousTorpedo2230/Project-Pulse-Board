import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TicketForm({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [label, setLabel] = useState('general')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      const userId = userData.user?.id
      if (!userId) throw new Error('User not authenticated')

      const { data: ticket, error: ticketErr } = await supabase
        .from('tickets')
        .insert([{ title, description, status: 'open', created_by: userId }])
        .select()
        .single()

      if (ticketErr) throw ticketErr

      const labelName = label.trim() || 'general'
      const { data: labelData, error: labelErr } = await supabase
        .from('labels')
        .upsert([{ name: labelName }])
        .select()
        .maybeSingle()

      if (labelErr) throw labelErr

      const labelId = labelData?.id
      if (labelId) {
        const { error: linkErr } = await supabase
          .from('tickets_labels')
          .insert([{ ticket_id: ticket.id, label_id: labelId }])
        if (linkErr) console.warn('Failed to link label:', linkErr.message)
      }

      const newTicket = { ...ticket, labels: labelId ? [labelName] : [] }
      onCreated && onCreated(newTicket)
      onClose && onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleCreate}
        className="bg-white p-6 rounded w-full max-w-lg shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">New Ticket</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded mb-3"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded mb-3 h-28"
          required
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. bug)"
          className="w-full border px-3 py-2 rounded mb-3"
        />
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Saving...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
