import { useAuth } from '@/core/hooks/useAuth.js';

export default function Home() {
  const { openAuthPopup } = useAuth();
  const handleAuthClick = () => {
    openAuthPopup();
  };
  return (
    <div>
      <main>
        <h1>This is Google Auth Test</h1>
        <button onClick={handleAuthClick}>login</button>
      </main>
    </div>
  );
}
