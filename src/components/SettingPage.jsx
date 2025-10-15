import React from 'react';
import { useProfileContext } from '../context/ProfileContext';

export default function SettingPage(){
  const { profile, loading, setAsAdmin, setAsUser } = useProfileContext();
  if(loading) return <div>Loading...</div>;
  return (
    <div style={{padding:20}}>
      <h2>Settings</h2>
      <p>Current role: <strong>{profile?.role}</strong></p>
      <p>Email: {profile?.email ?? 'N/A'}</p>
      <div style={{marginTop:12}}>
        <button onClick={()=>setAsAdmin()}>Set as Admin (demo)</button>
        <button style={{marginLeft:8}} onClick={()=>setAsUser()}>Set as User (demo)</button>
      </div>
    </div>
  );
}
