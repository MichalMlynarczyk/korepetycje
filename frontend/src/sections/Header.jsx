import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api.js';
import authPanelImage from '../../images/ChatGPT Image 1 lip 2026, 00_48_53.png';

const GOOGLE_AUTH_URL = import.meta.env.VITE_GOOGLE_AUTH_URL || `${API_BASE_URL}/accounts/google/login/`;
const FACEBOOK_AUTH_URL = import.meta.env.VITE_FACEBOOK_AUTH_URL || `${API_BASE_URL}/accounts/facebook/login/`;

const navItems = [
  { label: 'O nas', href: '#korepetytorzy', action: 'expand-tutors' },
  { label: 'Jak to działa', href: '#jak-to-dziala' },
  { label: 'Oferta', href: '#program' },
  { label: 'Cennik', href: '#cennik' },
  { label: 'Kontakt', href: '#kontakt' },
];

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: 'include',
  });
  const data = await response.json();

  return data.csrfToken;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return {};
  }

  return response.json();
}

async function authRequest(path, payload) {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok) {
    throw new Error(data.error ?? 'Coś poszło nie tak. Spróbuj ponownie.');
  }

  return data;
}

export function Header({ onAuthSuccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);
  const closeMenu = () => setIsMenuOpen(false);
  const closeAuth = () => {
    setAuthMode(null);
    setAuthNotice(null);
  };
  const openAuth = (mode) => {
    setAuthNotice(null);
    setAuthMode(mode);
    closeMenu();
  };

  useEffect(() => {
    const handleOpenAuth = (event) => {
      openAuth(event.detail?.mode === 'login' ? 'login' : 'register');
    };

    window.addEventListener('nastomatma:open-auth', handleOpenAuth);

    return () => {
      window.removeEventListener('nastomatma:open-auth', handleOpenAuth);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailVerified = searchParams.get('email_verified');

    if (!emailVerified) {
      return;
    }

    setAuthMode('login');
    setAuthNotice(
      emailVerified === 'success'
        ? {
            type: 'success',
            message: 'Adres e-mail został potwierdzony. Możesz się zalogować.',
          }
        : {
            type: 'error',
            message: 'Link aktywacyjny jest nieprawidłowy albo wygasł.',
          },
    );

    searchParams.delete('email_verified');
    const queryString = searchParams.toString();
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`,
    );
  }, []);

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
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
          <a
            href="/"
            onClick={closeMenu}
            aria-label="NaSTOmatMa strona główna"
            className="shrink-0 text-xl font-extrabold tracking-tight sm:text-3xl"
          >
            <span className="text-slate-900">Na</span>
            <span className="text-[#007566]">STO</span>
            <span className="text-slate-900">mat</span>
            <span className="text-[#007566]">Ma</span>
          </a>

          <nav className="hidden items-center gap-10 text-base font-medium text-slate-700 xl:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.action === 'expand-tutors') {
                    window.dispatchEvent(new CustomEvent('nastomatma:expand-tutors'));
                  }
                }}
                className="transition hover:text-[#007566]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <button
              type="button"
              onClick={() => openAuth('login')}
              className="rounded-xl bg-[#007566] px-6 py-4 text-base font-extrabold text-white shadow-[0_8px_18px_rgba(0,117,102,0.18)] transition hover:bg-[#005d51]"
            >
              Zaloguj się
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-[#007566] bg-white text-[#07463f] transition hover:bg-[#eff8f5] sm:h-12 sm:w-12 xl:hidden"
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
          className={`border-t border-zinc-100 bg-white px-4 shadow-[0_18px_35px_rgba(15,23,42,0.08)] transition-all duration-300 sm:px-6 xl:hidden ${
            isMenuOpen
              ? 'max-h-[560px] opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 py-4 text-sm font-bold text-slate-700 sm:py-5 sm:text-base">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.action === 'expand-tutors') {
                    window.dispatchEvent(new CustomEvent('nastomatma:expand-tutors'));
                  }
                  closeMenu();
                }}
                className="rounded-md px-3 py-2.5 transition hover:bg-[#eff8f5] hover:text-[#007566] sm:px-4 sm:py-3"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-4">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="inline-flex w-full items-center justify-center rounded-md bg-[#007566] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,117,102,0.18)] transition hover:bg-[#005d51] sm:px-5 sm:py-4 sm:text-base"
              >
                Zaloguj się
              </button>
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
          initialStatus={authNotice}
        />
      )}
    </>
  );
}

function AuthModal({ mode, onClose, onSwitchMode, onAuthSuccess, initialStatus }) {
  const isRegister = mode === 'register';
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [status, setStatus] = useState(initialStatus ?? { type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

      if (result.requires_email_verification) {
        setStatus({
          type: 'success',
          message: result.detail ?? 'Sprawdź skrzynkę e-mail i kliknij link aktywacyjny.',
        });
        setFormData((current) => ({
          ...current,
          password: '',
          password_confirm: '',
        }));
        return;
      }

      setStatus({
        type: 'success',
        message: isRegister
          ? 'Konto zostało utworzone.'
          : 'Zalogowano pomyślnie.',
      });
      onAuthSuccess?.(result.user, { isRegister });
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

  const handleSocialRegister = (provider) => {
    const authUrl = provider === 'google' ? GOOGLE_AUTH_URL : FACEBOOK_AUTH_URL;

    if (!authUrl) {
      setStatus({
        type: 'error',
        message:
          provider === 'google'
            ? 'Rejestracja przez Gmail będzie dostępna po podłączeniu Google OAuth.'
            : 'Rejestracja przez Facebook będzie dostępna po podłączeniu Facebook OAuth.',
      });
      return;
    }

    window.location.href = authUrl;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onMouseDown={onClose}
    >
      <div
        className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] lg:grid-cols-[1.08fr_0.92fr]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition hover:bg-orange-50 hover:text-orange-600"
          aria-label="Zamknij panel"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="relative hidden min-h-[34rem] lg:block">
          <img src={authPanelImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col px-6 py-7 sm:px-10 sm:py-9">
          <div className="mx-auto w-full max-w-[23rem]">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                <GraduationCapMark className="h-8 w-8" />
              </div>
              <div>
                <p className="text-2xl font-black leading-none tracking-normal">
                  <span className="text-slate-950">Na</span>
                  <span className="text-[#007566]">STO</span>
                  <span className="text-slate-950">mat</span>
                  <span className="text-[#007566]">Ma</span>
                </p>
                <p className="mt-1 text-xs font-bold text-slate-400">Matematyka, którą rozumiesz</p>
              </div>
            </div>

            <div className="mt-7 text-center">
              <h2 id="auth-title" className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                {isRegister ? 'Załóż konto' : 'Witaj ponownie!'}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {isRegister
                  ? 'Zarejestruj się i śledź postępy po lekcjach.'
                  : 'Zaloguj się, aby kontynuować naukę.'}
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <AuthField
                  id="auth-name"
                  icon={<UserIcon className="h-5 w-5" />}
                  placeholder="Imię i nazwisko"
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={updateField('full_name')}
                />
              )}

              <AuthField
                id="auth-email"
                icon={<MailIcon className="h-5 w-5" />}
                type="email"
                placeholder="Adres e-mail"
                autoComplete="email"
                value={formData.email}
                onChange={updateField('email')}
              />

              <AuthField
                id="auth-password"
                icon={<LockIcon className="h-5 w-5" />}
                type={showPassword ? 'text' : 'password'}
                placeholder={isRegister ? 'Hasło - minimum 6 znaków' : 'Hasło'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={formData.password}
                onChange={updateField('password')}
                action={
                  <button
                    type="button"
                    onClick={() => setShowPassword((isVisible) => !isVisible)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
                    aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                }
              />

              {isRegister && (
                <AuthField
                  id="auth-repeat-password"
                  icon={<LockIcon className="h-5 w-5" />}
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="Powtórz hasło"
                  autoComplete="new-password"
                  value={formData.password_confirm}
                  onChange={updateField('password_confirm')}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm((isVisible) => !isVisible)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"
                      aria-label={showPasswordConfirm ? 'Ukryj hasło' : 'Pokaż hasło'}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  }
                />
              )}

              {!isRegister && (
                <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-500">
                  <label className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-zinc-300 text-orange-600 focus:ring-orange-600"
                    />
                    <span>Zapamiętaj mnie</span>
                  </label>
                  <button
                    type="button"
                    className="shrink-0 text-orange-600 transition hover:text-orange-700"
                  >
                    Nie pamiętasz hasła?
                  </button>
                </div>
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
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-orange-600 px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.22)] transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? 'Chwileczkę...'
                  : isRegister
                    ? 'Zarejestruj się'
                    : 'Zaloguj się'}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-4 text-xs font-bold text-slate-400">
              <span className="h-px flex-1 bg-zinc-200" />
              lub
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => handleSocialRegister('google')}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-zinc-200 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <GoogleIcon className="h-5 w-5" />
                {isRegister ? 'Zarejestruj przez Google' : 'Zaloguj przez Google'}
              </button>
              <button
                type="button"
                onClick={() => handleSocialRegister('facebook')}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-md border border-zinc-200 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:border-orange-200 hover:bg-orange-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-white">
                  <FacebookIcon className="h-4 w-4" />
                </span>
                {isRegister ? 'Zarejestruj przez Facebook' : 'Zaloguj przez Facebook'}
              </button>
            </div>

            <p className="mt-6 text-center text-sm font-semibold text-slate-500">
              {isRegister ? 'Masz już konto?' : 'Nie masz jeszcze konta?'}{' '}
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

        <div className="grid gap-4 border-t border-zinc-200 bg-[#fcfaf7] px-6 py-4 sm:grid-cols-3 sm:px-10 lg:col-span-2">
          <AuthBenefit icon={<VerifiedIcon className="h-5 w-5" />} title="Sprawdzeni korepetytorzy" text="Tylko zweryfikowane osoby" />
          <AuthBenefit icon={<PlanIcon className="h-5 w-5" />} title="Indywidualne podejście" text="Lekcje dopasowane do Ciebie" />
          <AuthBenefit icon={<ShieldIcon className="h-5 w-5" />} title="Lepsze wyniki" text="Skuteczna nauka matematyki" />
        </div>
      </div>
    </div>
  );
}

function AuthBenefit({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-black text-slate-800">{title}</span>
        <span className="block text-xs font-semibold text-slate-500">{text}</span>
      </span>
    </div>
  );
}

function AuthField({ id, icon, type = 'text', placeholder, autoComplete, value, onChange, action }) {
  return (
    <label htmlFor={id} className="block">
      <span className="flex h-12 items-center rounded-md border border-zinc-200 bg-white text-slate-400 transition focus-within:border-orange-600">
        <span className="pointer-events-none flex h-full w-11 items-center justify-center">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="h-full min-w-0 flex-1 bg-transparent pr-3 text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
        />
        {action && <span className="mr-2 shrink-0">{action}</span>}
      </span>
    </label>
  );
}

function GraduationCapMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="m3 9 9-4 9 4-9 4-9-4Zm4 3v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V12m4-3v6"
      />
    </svg>
  );
}

function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16v12H4V6Zm0 2 8 5 8-5"
      />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12v9H6v-9Zm6 4v2"
      />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
    </svg>
  );
}

function VerifiedIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 3 8 4v5c0 5-3.4 7.9-8 9-4.6-1.1-8-4-8-9V7l8-4Zm-3 9 2 2 4-4"
      />
    </svg>
  );
}

function PlanIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 4h14v16H5V4Zm4 5h6M9 13h6M9 17h3"
      />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 3 8 4v5c0 5-3.4 7.9-8 9-4.6-1.1-8-4-8-9V7l8-4Zm-3 9 2 2 4-4"
      />
    </svg>
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

function GoogleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.74-.07-1.46-.19-2.14H12v4.05h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.32 2.98-7.44Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.95-3.38.95-2.6 0-4.81-1.76-5.6-4.12H3.06v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.89a6.01 6.01 0 0 1 0-3.78V7.52H3.06a10 10 0 0 0 0 8.96l3.34-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.99c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 3 14.7 2 12 2a10 10 0 0 0-8.94 5.52l3.34 2.59C7.19 7.75 9.4 5.99 12 5.99Z"
      />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z"
      />
    </svg>
  );
}
