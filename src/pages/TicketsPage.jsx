import React, { useEffect, useState } from 'react'
import TicketCard from '../components/TicketCard'
import TicketForm from '../components/TicketForm'
import { supabase } from '../lib/supabaseClient'

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  async function fetchTickets() {
    setLoading(true)
    try {
      const { data: ticketsData, error: ticketsErr } = await supabase
        .from('tickets')
        .select('id, title, description, status, created_by, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (ticketsErr) throw ticketsErr
      const ticketsArr = ticketsData || []
      const ids = ticketsArr.map((t) => t.id)
      let labelsMap = {}

      if (ids.length) {
        const { data: links, error: linksErr } = await supabase
          .from('tickets_labels')
          .select('ticket_id, labels(name)')
          .in('ticket_id', ids)

        if (linksErr) throw linksErr

        labelsMap = links.reduce((acc, item) => {
          const name = item.labels?.name || null
          if (!acc[item.ticket_id]) acc[item.ticket_id] = []
          if (name) acc[item.ticket_id].push(name)
          return acc
        }, {})
      }

      const ticketsWithLabels = ticketsArr.map((t) => ({
        ...t,
        labels: labelsMap[t.id] || []
      }))

      setTickets(ticketsWithLabels)
    } catch (err) {
      console.error('❌ Failed to fetch tickets:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = tickets.filter(
    (t) =>
      t.title?.toLowerCase().includes(query.toLowerCase()) ||
      t.description?.toLowerCase().includes(query.toLowerCase())
  )

  function handleTicketCreated(newTicket) {
    setTickets((prev) => [newTicket, ...prev])
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search tickets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          + New Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading tickets...</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-500">No tickets found.</div>
          )}
        </div>
      )}

      {showForm && (
        <TicketForm
          onClose={() => setShowForm(false)}
          onCreated={handleTicketCreated}
        />
      )}
    </div>
  )
}
