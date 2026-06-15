import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Jak to działa', href: '#jak-to-dziala' },
  { label: 'Dlaczego my?', href: '#dlaczego-my' },
  { label: 'Cennik', href: '#cennik' },
  { label: 'Korepetytorzy', href: '#korepetytorzy' },
  { label: 'Kontakt', href: '#kontakt' },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

async function authRequest(path, payload) {
  await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: 'include',
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': decodeURIComponent(getCookie('csrftoken') ?? ''),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Coś poszło nie tak. Spróbuj ponownie.');
  }

  return data;
}

export function Header({ onAuthSuccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const closeMenu = () => setIsMenuOpen(false);
  const closeAuth = () => setAuthMode(null);
  const openAuth = (mode) => {
    setAuthMode(mode);
    closeMenu();
  };

  useEffect(() => {
    if (!authMode) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAuth();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authMode]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:h-24 lg:px-10">
          <a
            href="/"
            onClick={closeMenu}
            aria-label="NaSTOmatMa strona główna"
            className="shrink-0 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            <span className="text-slate-900">Na</span>
            <span className="text-orange-600">STO</span>
            <span className="text-slate-900">mat</span>
            <span className="text-orange-600">Ma</span>
          </a>

          <nav className="hidden items-center gap-10 text-base font-semibold text-slate-500 xl:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="rounded-md border-2 border-slate-500 px-6 py-3 text-base font-bold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
            >
              Zaloguj się
            </button>
            <a
              href="#cennik"
              className="rounded-md bg-orange-600 px-6 py-3 text-base font-bold text-white shadow-[0_8px_18px_rgba(159,95,44,0.25)] transition hover:bg-orange-700"
            >
              Wybierz pakiet
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-md border-2 border-slate-500 bg-white text-slate-900 transition hover:border-slate-900 xl:hidden"
            aria-label={isMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="relative h-5 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition ${
                  isMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 rounded-full bg-current transition ${
                  isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`border-t border-zinc-200 bg-white px-6 shadow-[0_18px_35px_rgba(15,23,42,0.08)] transition-all duration-300 xl:hidden ${
            isMenuOpen
              ? 'max-h-[560px] opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 py-5 text-base font-bold text-slate-700">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-md px-4 py-3 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="inline-flex items-center justify-center rounded-md border-2 border-slate-500 px-5 py-4 text-base font-bold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Zaloguj się
              </button>
              <a
                href="#cennik"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-4 text-base font-bold text-white shadow-[0_8px_18px_rgba(159,95,44,0.25)] transition hover:bg-orange-700"
              >
                Wybierz pakiet
              </a>
            </div>
          </nav>
        </div>
      </header>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onSwitchMode={setAuthMode}
          onAuthSuccess={onAuthSuccess}
        />
      )}
    </>
  );
}

function AuthModal({ mode, onClose, onSwitchMode, onAuthSuccess }) {
  const isRegister = mode === 'register';
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const result = await authRequest(
        isRegister ? '/api/auth/register/' : '/api/auth/login/',
        isRegister
          ? formData
          : {
              email: formData.email,
              password: formData.password,
            },
      );

      setStatus({
        type: 'success',
        message: isRegister
          ? 'Konto zostało utworzone. Jesteś zalogowany.'
          : 'Zalogowano pomyślnie.',
      });
      onAuthSuccess?.(result.user);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setStatus({ type: null, message: '' });
    onSwitchMode(isRegister ? 'login' : 'register');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onMouseDown={onClose}
    >
      <div
        className="relative my-auto w-full max-w-[34rem] rounded-2xl bg-white px-7 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.35)] sm:px-10 sm:py-10"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
          aria-label="Zamknij panel"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <p className="pr-12 text-3xl font-black tracking-tight sm:text-4xl">
          <span className="text-slate-950">Na</span>
          <span className="text-orange-600">STO</span>
          <span className="text-slate-950">mat</span>
          <span className="text-orange-600">Ma</span>
        </p>

        <h2 id="auth-title" className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
          {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
        </h2>
        <p className="mt-2 text-base font-medium text-slate-400 sm:text-lg">
          {isRegister
            ? 'Załóż konto i śledź swoje postępy naukowe.'
            : 'Wejdź do swojego panelu ucznia.'}
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <AuthField
              id="auth-name"
              label="Imię i nazwisko ucznia / rodzica"
              placeholder="Jan Kowalski"
              autoComplete="name"
              value={formData.full_name}
              onChange={updateField('full_name')}
            />
          )}

          <AuthField
            id="auth-email"
            label="Adres e-mail"
            type="email"
            placeholder="twoj@email.com"
            autoComplete="email"
            value={formData.email}
            onChange={updateField('email')}
          />

          <AuthField
            id="auth-password"
            label="Hasło"
            type="password"
            placeholder={isRegister ? 'Minimum 6 znaków' : '••••••••'}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            value={formData.password}
            onChange={updateField('password')}
          />

          {isRegister && (
            <AuthField
              id="auth-repeat-password"
              label="Powtórz hasło"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={formData.password_confirm}
              onChange={updateField('password_confirm')}
            />
          )}

          {status.message && (
            <p
              className={`rounded-md px-4 py-3 text-sm font-bold ${
                status.type === 'success'
                  ? 'bg-orange-50 text-orange-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-6 py-5 text-lg font-extrabold text-white shadow-[0_14px_30px_rgba(159,95,44,0.22)] transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? 'Chwileczkę...'
              : isRegister
                ? 'Zarejestruj się'
                : 'Zaloguj się'}
          </button>
        </form>

        <p className="mt-6 text-center text-base font-medium text-slate-500">
          {isRegister ? 'Masz już konto?' : 'Nie masz konta?'}{' '}
          <button
            type="button"
            onClick={switchMode}
            className="font-black text-orange-600 transition hover:text-orange-700"
          >
            {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </p>
      </div>
    </div>
  );
}

function AuthField({ id, label, type = 'text', placeholder, autoComplete, value, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-base font-black text-slate-800">{label}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="h-14 w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-lg font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-orange-600 focus:bg-white"
      />
    </label>
  );
}

function CloseIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
        d="M6 6l12 12M18 6 6 18"
      />
    </svg>
  );
}
