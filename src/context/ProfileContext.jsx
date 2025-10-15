import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const ProfileContext = createContext();

export function useProfileContext() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession ? null : null; 
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (!error && !cancelled) setProfile(data);
      setLoading(false);
    };
    fetchProfile();

    const subscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` }, payload => {
        fetchProfile();
      })
      .subscribe();

    return () => {
      cancelled = true;
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  const setRole = async (role) => {
    if (!user) throw new Error('No user');
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('user_id', user.id)
      .select()
      .single();
    if (!error) setProfile(data);
    setLoading(false);
    return { data, error };
  };

  const setAsAdmin = () => setRole('Admin');
  const setAsUser = () => setRole('User');

  const value = { user, profile, loading, setAsAdmin, setAsUser };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
