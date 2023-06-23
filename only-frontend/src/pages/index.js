import { useAuth } from '@/core/hooks/useAuth.js';

export default function Home() {
  const { openAuthPopup, logout } = useAuth();
  const handleLoginClick = () => {
    openAuthPopup();
  };
  const handleLogoutClick = () => {
    logout();
  };

  return (
    <div>
      <main>
        <h1>This is Google Auth Test</h1>
        <button onClick={handleLoginClick}>login</button>
        <button onClick={handleLogoutClick}>logout</button>
      </main>
    </div>
  );
}
