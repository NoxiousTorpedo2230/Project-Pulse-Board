import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar({ session, profile }) {
  const navigate = useNavigate()

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/login') 
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
      <div className="flex items-center gap-6">
        <div
          onClick={() => navigate('/tickets')}
          className="text-2xl font-bold cursor-pointer"
        >
          PulseBoard
        </div>

        {session && (
          <nav className="hidden sm:flex gap-4">
            <Link to="/tickets" className="hover:underline">
              Tickets
            </Link>

            {profile?.role === 'admin' && (
              <Link to="/settings" className="hover:underline">
                Settings
              </Link>
            )}
          </nav>
        )}
      </div>

      <div>
        {session ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-200">{session.user.email}</div>

            {profile && (
              <div
                className={`text-xs font-medium px-3 py-1 border rounded ${
                  profile.role === 'admin'
                    ? 'bg-green-700 border-green-500'
                    : 'bg-gray-800 border-gray-600'
                }`}
              >
                {profile.role === 'admin' ? 'Admin' : 'User'}
              </div>
            )}

            <button
              onClick={signOut}
              className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
