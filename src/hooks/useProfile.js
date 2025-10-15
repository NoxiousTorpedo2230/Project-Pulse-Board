import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

function useProfile() {
  const user = useUser()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('display_name, role')
        .eq('user_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (!error) setProfile(data)
        })
    }
  }, [user])

  return profile
}

export default function Dashboard() {
  const profile = useProfile()

  if (!profile) return <p>Loading...</p>

  return (
    <div>
      <h2>Welcome, {profile.display_name}</h2>
      {profile.role === 'admin' ? (
        <p>✅ You are an admin!</p>
      ) : (
        <p>👤 You are a regular user.</p>
      )}
    </div>
  )
}
