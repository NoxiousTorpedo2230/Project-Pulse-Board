import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lpetncsclhidwqilfuti.supabase.co'
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZXRuY3NjbGhpZHdxaWxmdXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTEyMDIsImV4cCI6MjA3NjA4NzIwMn0.V1rMPEuWWqDuaap42Knxm4oiQndAkwcx9177zvlpu8I'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: true, autoRefreshToken: true },
})
  