import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection'

export default function TicketDetailsPage({ supabase, profile }){
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const res = await fetch(`/api/tickets/${id}`)
        if (res.ok){ setTicket(await res.json()) }
        else {
          const { data } = await supabase.from('tickets').select('*').eq('id', id).single()
          setTicket(data)
        }
      }catch(e){
        const { data } = await supabase.from('tickets').select('*').eq('id', id).single()
        setTicket(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="text-gray-500">Loading ticket...</div>
  if (!ticket) return <div className="text-red-500">Ticket not found.</div>

  async function closeTicket(){
    if (!profile || profile.role !== 'admin') return alert('Only admins can close tickets')
    try{
      await supabase.from('tickets').update({ status: 'closed' }).eq('id', ticket.id)
      setTicket({...ticket, status: 'closed'})
    }catch(e){ console.error(e); alert('Failed to close') }
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
          <p className="text-gray-700 mb-4">{ticket.description}</p>
          <div className="flex items-center gap-2 mb-6">
            {ticket.labels && ticket.labels.map(l => <span key={l} className="bg-gray-100 px-2 py-1 rounded text-sm">{l}</span>)}
            <span className={`text-sm ${ticket.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>{ticket.status}</span>
          </div>
        </div>
        {profile && profile.role === 'admin' && (
          <div className="space-y-2">
            <button onClick={closeTicket} className="px-3 py-2 bg-red-600 text-white rounded">Close Ticket</button>
          </div>
        )}
      </div>

      <CommentSection ticketId={ticket.id} supabase={supabase} />
    </div>
  )
}
