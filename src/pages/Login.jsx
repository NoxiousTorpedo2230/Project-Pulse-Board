import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login(){
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleLogin(e){
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('Check your email for a login link / OTP.')
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">Sign in</h1>
      <p className="text-gray-600 mb-6">Enter your email to sign in (Supabase Email OTP)</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button className="w-full bg-black text-white py-2 rounded" disabled={loading}>{loading ? 'Sending...' : 'Send Magic Link / OTP'}</button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  )
}

