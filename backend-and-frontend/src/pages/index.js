import { useAuth } from '@/core/hooks/useAuth.js';
import { getAuthCode, getUserInfo } from '@/core/apis/auth.js';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const { openLoginPopup, logout } = useAuth();

  const handleLoginClick = async () => {
    const response = await getAuthCode();
    openLoginPopup(response.location);
  };
  const handleLogoutClick = () => {
    logout();
    setUser(null);
  };
  const handleUserClick = async () => {
    const user = await getUserInfo(localStorage.getItem('accessToken'));
    setUser(user);
  };

  return (
    <div>
      <main>
        <h1>This is Google Auth Test</h1>
        <button onClick={handleLoginClick}>login</button>
        <button onClick={handleLogoutClick}>logout</button>
        <button onClick={handleUserClick}>get user</button>
        {user &&
          [<h2 key="">user info</h2>].concat(
            Object.values(user).map((value, index) => {
              return <li key={index}>{value}</li>;
            })
          )}
      </main>
    </div>
  );
}
