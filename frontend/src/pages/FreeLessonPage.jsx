import { useState } from 'react';
import { API_BASE_URL } from '../api.js';
import individualLearningImage from '../assets/individual-learning.png';

const initialForm = {
  parent_full_name: '',
  student_full_name: '',
  email: '',
  phone: '',
  school_class: '',
};

const classOptions = [
  '1 klasa SP',
  '2 klasa SP',
  '3 klasa SP',
  '4 klasa SP',
  '5 klasa SP',
  '6 klasa SP',
  '7 klasa SP',
  '8 klasa SP',
  '1 klasa liceum/technikum',
  '2 klasa liceum/technikum',
  '3 klasa liceum/technikum',
  '4 klasa liceum/technikum',
  'Matura',
];

const highlights = [
  { icon: <ClockIcon />, title: 'Do 40 minut', text: 'lekcji próbnej' },
  { icon: <CalendarIcon />, title: 'Do 14 sierpnia', text: '2026' },
  { icon: <ShieldIcon />, title: 'Bez zobowiązań', text: '100% darmowe' },
];

const benefits = [
  { icon: <ChatIcon />, title: 'Poznasz nauczyciela', text: 'Poznasz naszego nauczyciela i metody pracy' },
  { icon: <TargetIcon />, title: 'Sprawdzisz poziom', text: 'Sprawdzimy poziom wiedzy i zidentyfikujemy potrzeby' },
  { icon: <LightbulbIcon />, title: 'Otrzymasz wskazówki', text: 'Dostaniesz konkretne wskazówki do dalszej nauki' },
  { icon: <CalendarIcon />, title: 'Ustalimy plan', text: 'Ustalimy najlepszy plan nauki dopasowany do potrzeb' },
];

export function FreeLessonPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/free-lesson/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          source_path: window.location.pathname,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się wysłać zgłoszenia.');
      }

      setForm(initialForm);
      setStatus({
        type: 'success',
        message: data.detail || 'Zgłoszenie zostało zapisane. Skontaktujemy się z Tobą.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie później.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#0b4f47]">
      <div className="min-h-screen w-full overflow-hidden bg-[#fffdf9]">
        <header className="border-b border-[#e7e2da] px-5 sm:px-10">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
            <a href="/" className="text-lg font-black tracking-tight">
              NaSTOmatMa
            </a>
            <nav className="hidden items-center gap-9 text-xs font-bold text-slate-700 md:flex">
              <a href="/#o-nas" className="transition hover:text-[#007f6d]">O nas</a>
              <a href="/#jak-to-dziala" className="transition hover:text-[#007f6d]">Jak to działa</a>
              <a href="/#oferta" className="transition hover:text-[#007f6d]">Oferta</a>
              <a href="/#cennik" className="transition hover:text-[#007f6d]">Cennik</a>
              <a href="/#kontakt" className="transition hover:text-[#007f6d]">Kontakt</a>
            </nav>
            <a
              href="/"
              className="rounded-md bg-[#007f6d] px-5 py-2 text-xs font-black text-white shadow-lg shadow-[#007f6d]/25 transition hover:bg-[#006a5b]"
            >
              Zaloguj się
            </a>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-10 lg:px-16">
          <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded border border-[#76c9bb] bg-[#eefaf6] px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#007f6d]">
                Darmowa lekcja
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl lg:text-[64px]">
                <span className="block text-[#07584f]">Darmowa lekcja</span>
                <span className="block text-[#07584f]">matematyki</span>
                <span className="block text-[#edb24b]">do 14 sierpnia</span>
              </h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-7 text-slate-700">
                Skorzystaj z darmowej lekcji próbnej do 40 minut. Poznaj nasze metody nauczania
                i przekonaj się, jak możemy pomóc Twojemu dziecku w matematyce.
              </p>

              <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dff3ec] text-[#007f6d]">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block text-xs font-black text-[#07584f]">{item.title}</span>
                      <span className="block text-xs font-semibold text-slate-500">{item.text}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[430px]">
              <div className="absolute -left-12 top-16 hidden grid-cols-3 gap-3 lg:grid">
                {Array.from({ length: 18 }).map((_, index) => (
                  <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#99d4c8]" />
                ))}
              </div>
              <div className="absolute -right-2 bottom-4 h-28 w-28 rounded-full bg-[#f2c66d]" />
              <div className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-[#dceee7]" />
              <div className="relative overflow-hidden rounded-[45%_55%_48%_52%/45%_38%_62%_55%] border-[10px] border-white bg-[#f1e7d6] shadow-xl">
                <img
                  src={individualLearningImage}
                  alt="Uczennica podczas nauki matematyki"
                  className="aspect-[1.35] w-full object-cover"
                />
              </div>
              <div className="absolute right-0 top-14 text-sm font-black text-[#0b8070]">a² + b² = c²</div>
              <div className="absolute bottom-2 right-5 text-[#0b8070]">
                <TriangleIcon />
              </div>
            </div>
          </section>

          <section id="zapisz-sie" className="pt-14">
            <div className="mb-6 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#72b7a9]">Zapisz się</p>
              <h2 className="mt-2 text-3xl font-black text-[#07584f]">
                Zapisz dziecko na darmową lekcję
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-5xl rounded-lg border border-[#e2ddd5] bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-7"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 lg:border-r lg:border-[#e7e2da] lg:pr-7">
                  <SectionTitle icon={<UserIcon />} title="Dane rodzica / opiekuna" />
                  <Field
                    label="Imię i nazwisko rodzica"
                    name="parent_full_name"
                    value={form.parent_full_name}
                    onChange={updateField}
                    placeholder="Wpisz imię i nazwisko"
                    required
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="Wpisz adres e-mail"
                    required
                  />
                  <Field
                    label="Numer telefonu"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="Wpisz numer telefonu"
                    required
                  />
                </div>

                <div className="space-y-4 lg:pl-2">
                  <SectionTitle icon={<UserIcon />} title="Dane dziecka" />
                  <Field
                    label="Imię i nazwisko dziecka"
                    name="student_full_name"
                    value={form.student_full_name}
                    onChange={updateField}
                    placeholder="Wpisz imię i nazwisko dziecka"
                    required
                  />
                  <label className="grid gap-2 text-sm font-black text-slate-700">
                    Klasa <RequiredMark />
                    <select
                      name="school_class"
                      value={form.school_class}
                      onChange={updateField}
                      required
                      className="h-11 rounded-md border border-[#ddd8d1] bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#007f6d] focus:ring-4 focus:ring-[#dff3ec]"
                    >
                      <option value="">Wybierz klasę</option>
                      {classOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 w-full rounded-md bg-[#007f6d] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#007f6d]/20 transition hover:bg-[#006a5b] disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? 'Wysyłanie...' : 'Zapisz się na darmową lekcję'}
              </button>

              <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs font-semibold text-slate-500">
                <LockIcon />
                Twoje dane są bezpieczne i nie udostępniamy ich osobom trzecim.
              </p>

              {status.message && (
                <div
                  className={`mt-4 rounded-md px-4 py-3 text-sm font-bold ${
                    status.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {status.message}
                </div>
              )}
            </form>
          </section>

          <section className="py-14">
            <div className="mb-8 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#72b7a9]">
                Dlaczego warto?
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#07584f]">
                Co zyskujesz podczas darmowej lekcji?
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#dff3ec] text-[#007f6d]">
                    {benefit.icon}
                  </span>
                  <h3 className="mt-4 text-base font-black text-[#07584f]">{benefit.title}</h3>
                  <p className="mx-auto mt-2 max-w-48 text-sm font-semibold leading-6 text-slate-600">
                    {benefit.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-lg bg-[#eaf7f1] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#007f6d]">
                  <CalendarIcon />
                </span>
                <div>
                  <h3 className="text-base font-black text-[#07584f]">Nie czekaj!</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Liczba miejsc na darmowe lekcje jest ograniczona. Zapisz się już dziś.
                  </p>
                </div>
              </div>
              <a
                href="#zapisz-sie"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#007f6d] bg-white px-5 py-3 text-sm font-black text-[#007f6d] transition hover:bg-[#007f6d] hover:text-white"
              >
                <ChatIcon />
                Skontaktuj się z nami
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Field({ label, required = false, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-black text-slate-700">
      <span>
        {label}
        {required && <RequiredMark />}
      </span>
      <input
        {...props}
        required={required}
        className="h-11 rounded-md border border-[#ddd8d1] px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#007f6d] focus:ring-4 focus:ring-[#dff3ec]"
      />
    </label>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <h3 className="flex items-center gap-3 text-base font-black text-[#07584f]">
      <span className="text-[#007f6d]">{icon}</span>
      {title}
    </h3>
  );
}

function RequiredMark() {
  return <span className="ml-1 text-red-500">*</span>;
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 3v4M17 3v4M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 8.8 8.8 0 0 1-3.9-.9L3 20l1.2-4.4A8.1 8.1 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="m15 9 4-4M18 5h1v1" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M8 14a6 6 0 1 1 8 0c-.7.7-1 1.4-1 2H9c0-.6-.3-1.3-1-2Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function TriangleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 86 70" className="h-16 w-20" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M14 58h58L72 14 14 58Z" />
      <path d="M72 14v44" />
      <path d="M14 58h58" />
      <text x="8" y="62" fill="currentColor" stroke="none" fontSize="12" fontWeight="700">a</text>
      <text x="75" y="40" fill="currentColor" stroke="none" fontSize="12" fontWeight="700">c</text>
      <text x="42" y="69" fill="currentColor" stroke="none" fontSize="12" fontWeight="700">b</text>
    </svg>
  );
}
