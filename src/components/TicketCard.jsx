import React from 'react'

export default function TicketCard({ ticket }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{ticket.title}</h4>
          <p className="text-sm text-gray-600">{ticket.description}</p>
          <div className="mt-2 flex gap-2">
            {ticket.labels && ticket.labels.length > 0 ? ticket.labels.map((l, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">{l}</span>
            )) : <span className="text-xs text-gray-400">no labels</span>}
          </div>
        </div>
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${ticket.status==='open' ? 'bg-green-100' : 'bg-gray-200'}`}>{ticket.status}</span>
        </div>
      </div>
    </div>
  )
}
