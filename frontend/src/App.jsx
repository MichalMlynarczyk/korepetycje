import { useEffect, useState } from 'react';
import { Footer } from './sections/Footer.jsx';
import { AuthModal, Header } from './sections/Header.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { FreeLessonPage } from './pages/FreeLessonPage.jsx';
import { StudentPage } from './pages/StudentPage.jsx';
import { TeacherPage } from './pages/TeacherPage.jsx';
import { API_BASE_URL } from './api.js';

const FREE_LESSON_INTENT_KEY = 'nastomatma:free-lesson-intent';
const FREE_LESSON_PATH = '/darmowalekcja';

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: 'include',
  });
  const data = await response.json();

  return data.csrfToken;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [forceOnboardingUserId, setForceOnboardingUserId] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const isFreeLessonPage = currentPath === FREE_LESSON_PATH;

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

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

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isFreeLessonPage && !currentUser && typeof window !== 'undefined') {
      window.localStorage.setItem(FREE_LESSON_INTENT_KEY, 'pending');
    }
  }, [currentUser, isFreeLessonPage]);

  useEffect(() => {
    if (!currentUser || isFreeLessonPage || typeof window === 'undefined') {
      return;
    }

    if (window.localStorage.getItem(FREE_LESSON_INTENT_KEY) === 'pending') {
      setForceOnboardingUserId(null);
      navigateTo(FREE_LESSON_PATH);
    }
  }, [currentUser, isFreeLessonPage]);

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
    setForceOnboardingUserId(null);
  };

  const handleAuthSuccess = (user, context = {}) => {
    setCurrentUser(user);

    if (typeof window !== 'undefined' && window.localStorage.getItem(FREE_LESSON_INTENT_KEY) === 'pending') {
      setForceOnboardingUserId(null);
      navigateTo(FREE_LESSON_PATH);
      return;
    }

    if (context.isRegister) {
      setForceOnboardingUserId(user.id);
    }
  };

  const handleAccountDeleted = () => {
    setCurrentUser(null);
    setForceOnboardingUserId(null);
  };

  const handleFreeLessonComplete = (user) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(FREE_LESSON_INTENT_KEY);
    }
    setCurrentUser(user);
    setForceOnboardingUserId(null);
    navigateTo('/');
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
      {!currentUser && !isFreeLessonPage && <Header onAuthSuccess={handleAuthSuccess} />}
      <main className="min-h-screen bg-white text-slate-950">
        {isFreeLessonPage ? (
          currentUser ? (
            <FreeLessonPage user={currentUser} onComplete={handleFreeLessonComplete} />
          ) : (
            <FreeLessonAuthGate onAuthSuccess={handleAuthSuccess} />
          )
        ) : currentUser?.role === 'teacher' ? (
          <TeacherPage user={currentUser} onLogout={handleLogout} />
        ) : currentUser ? (
          <StudentPage
            user={currentUser}
            onLogout={handleLogout}
            onAccountDeleted={handleAccountDeleted}
            forceOnboarding={forceOnboardingUserId === currentUser.id}
          />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </>
  );
}

function FreeLessonAuthGate({ onAuthSuccess }) {
  const [authMode, setAuthMode] = useState('register');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fbfaf7]">
      <div className="absolute inset-0 bg-[#fbfaf7]" />
      <div className="relative mx-auto flex min-h-screen max-w-4xl items-center justify-center px-5 text-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#8fc1b2]">
            Darmowa lekcja
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#07463f] sm:text-5xl">
            Zaloguj się lub załóż konto
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-slate-600">
            Po rejestracji przejdziesz do formularza zapisu na darmową lekcję matematyki.
          </p>
        </div>
      </div>

      <AuthModal
        mode={authMode}
        onSwitchMode={setAuthMode}
        onAuthSuccess={onAuthSuccess}
        canClose={false}
      />
    </div>
  );
}

export default App;
