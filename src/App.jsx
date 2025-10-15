import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import TicketsPage from './pages/TicketsPage'
import TicketDetailsPage from './pages/TicketDetailsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import SettingPage from './components/SettingPage'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function getInitialSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      if (data.session) await loadProfile(data.session.user.id)
      setLoading(false)
    }
    getInitialSession()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        loadProfile(session.user.id)
        navigate('/tickets')
      } else {
        setProfile(null)
        navigate('/login')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])
  async function loadProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error
      setProfile(data || null)
    } catch (err) {
      console.error('Error loading profile:', err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar session={session} profile={profile} />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute session={session}>
                <TicketsPage supabase={supabase} profile={profile} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute session={session}>
                <TicketDetailsPage supabase={supabase} profile={profile} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute session={session}>
                <TicketsPage supabase={supabase} profile={profile} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute session={session}>
                <SettingPage supabase={supabase} profile={profile} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
