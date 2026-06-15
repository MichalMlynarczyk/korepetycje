import { useEffect, useState } from 'react';
import { Footer } from './sections/Footer.jsx';
import { Header } from './sections/Header.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { StudentPage } from './pages/StudentPage.jsx';
import { TeacherPage } from './pages/TeacherPage.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

async function getCsrfToken() {
  await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: 'include',
  });

  return decodeURIComponent(getCookie('csrftoken') ?? '');
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/api/auth/me/`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (isMounted && data.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCurrentUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsAuthChecked(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const csrfToken = await getCsrfToken();

    await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });

    setCurrentUser(null);
  };

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfaf7] text-base font-bold text-slate-500">
        Ładowanie...
      </div>
    );
  }

  return (
    <>
      {!currentUser && <Header onAuthSuccess={setCurrentUser} />}
      <main className="min-h-screen bg-white text-slate-950">
        {currentUser?.role === 'teacher' ? (
          <TeacherPage user={currentUser} onLogout={handleLogout} />
        ) : currentUser ? (
          <StudentPage user={currentUser} onLogout={handleLogout} />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
