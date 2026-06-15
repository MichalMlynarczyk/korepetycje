import { useState } from 'react';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'payments', label: 'Płatności', icon: 'chart' },
  { id: 'chat', label: 'Czat z korepetytorem', icon: 'chat' },
  { id: 'notes', label: 'Notatki i pliki', icon: 'file' },
];

const availableSlots = [
  { tutor: 'Kuba', subject: 'Matematyka rozszerzona', day: 'Poniedziałek', date: '24 czerwca', time: '17:00', duration: '60 min' },
  { tutor: 'Hubert', subject: 'Geometria i podstawa', day: 'Wtorek', date: '25 czerwca', time: '18:30', duration: '60 min' },
  { tutor: 'Kuba', subject: 'Fizyka', day: 'Czwartek', date: '27 czerwca', time: '16:00', duration: '90 min' },
];

const paymentPlans = [
  { name: 'START', price: 99, lessons: '1 lekcja tygodniowo', total: '396 zł / miesiąc' },
  { name: 'PLUS', price: 89, lessons: '2 lekcje tygodniowo', total: '712 zł / miesiąc', active: true },
  { name: 'INTENSIV', price: 79, lessons: '3 lekcje tygodniowo', total: '948 zł / miesiąc' },
];

const messages = [
  { author: 'Kuba', text: 'Cześć! Wrzuciłem notatkę z funkcji kwadratowej. Przerób zadania 1-4 przed kolejną lekcją.', time: '10:24' },
  { author: 'Ty', text: 'Super, dzięki. Zadanie 3 sprawdzę jeszcze raz, bo nie jestem pewien delty.', time: '10:31', own: true },
  { author: 'Kuba', text: 'Jasne, przy następnym spotkaniu przejdziemy to krok po kroku.', time: '10:33' },
];

const files = [
  { name: 'Funkcja kwadratowa - notatka.pdf', tutor: 'Kuba', date: '18 czerwca', size: '1.2 MB' },
  { name: 'Geometria - zadania do powtórki.pdf', tutor: 'Hubert', date: '16 czerwca', size: '840 KB' },
  { name: 'Plan przygotowania do matury.docx', tutor: 'Kuba', date: '12 czerwca', size: '320 KB' },
];

export function StudentPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const displayName = user?.full_name || user?.email || 'Uczeń';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <section className="min-h-screen bg-[#f7f6f2]">
      <StudentHeader
        displayName={displayName}
        initial={initial}
        onLogout={onLogout}
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-600">
            Panel ucznia
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Cześć, {displayName.split(' ')[0] || 'uczniu'}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-500">
            Rezerwuj lekcje, opłać pakiet, pisz do korepetytora i odbieraj materiały z zajęć.
          </p>
        </div>

        <StudentTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-8">
          {activeTab === 'calendar' && <CalendarPanel />}
          {activeTab === 'payments' && <PaymentsPanel />}
          {activeTab === 'chat' && <ChatPanel />}
          {activeTab === 'notes' && <NotesPanel />}
        </div>
      </div>
    </section>
  );
}

function StudentHeader({ displayName, initial, onLogout }) {
  return (
    <header className="bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <a
          href="/"
          aria-label="NaSTOmatMa panel ucznia"
          className="shrink-0 text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          <span className="text-white">Na</span>
          <span className="text-orange-600">STO</span>
          <span className="text-white">mat</span>
          <span className="text-orange-600">Ma</span>
        </a>

        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white shadow-[0_10px_24px_rgba(159,95,44,0.28)]">
            {initial}
          </span>
          <div className="hidden text-right sm:block">
            <p className="text-base font-black">Uczeń</p>
            <p className="max-w-[14rem] truncate text-sm font-medium text-slate-300">
              {displayName}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-white/20 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-orange-500 hover:text-white sm:px-5"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </header>
  );
}

function StudentTabs({ activeTab, onChange }) {
  return (
    <div className="mt-10 rounded-lg bg-[#e9e6df] p-2">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-3 rounded-md px-5 py-4 text-left text-base font-black transition ${
                isActive
                  ? 'bg-white text-slate-950 shadow-[0_10px_24px_rgba(39,40,45,0.08)]'
                  : 'text-slate-700 hover:bg-white/55'
              }`}
            >
              <TabIcon type={tab.icon} className="h-6 w-6 shrink-0 text-orange-600" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
        <h2 className="text-2xl font-black text-slate-950">Dostępne terminy</h2>
        <p className="mt-2 text-base font-medium text-slate-500">
          Kafelki dodane przez korepetytorów. Docelowo kliknięcie zarezerwuje lekcję.
        </p>

        <div className="mt-7 grid gap-4">
          {availableSlots.map((slot) => (
            <article key={`${slot.tutor}-${slot.date}-${slot.time}`} className="rounded-lg border border-zinc-200 bg-[#fcfaf7] px-5 py-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">
                    {slot.day}, {slot.date}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">{slot.time}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {slot.duration} z {slot.tutorem}
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-600">{slot.subject}</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-4 text-sm font-black text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700"
                >
                  Zarezerwuj
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-slate-950 px-6 py-7 text-white shadow-[0_16px_36px_rgba(39,40,45,0.12)] sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-orange-500">Najbliższa lekcja</p>
        <h2 className="mt-4 text-3xl font-black">Wtorek, 18:30</h2>
        <p className="mt-3 text-base font-medium leading-7 text-slate-300">
          Matematyka podstawowa z Hubertem. Link do spotkania pojawi się 15 minut przed lekcją.
        </p>
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-5 py-5">
          <p className="text-sm font-bold text-slate-400">Status</p>
          <p className="mt-2 text-xl font-black text-orange-500">Zarezerwowana</p>
        </div>
      </section>
    </div>
  );
}

function PaymentsPanel() {
  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Pakiety i płatności</h2>
          <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">
            Widok przygotowany pod płatności online. Na razie pokazuje wybrany pakiet i akcję opłacenia.
          </p>
        </div>
        <p className="rounded-md bg-orange-50 px-4 py-3 text-sm font-black text-orange-600">
          Aktywny pakiet: PLUS
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        {paymentPlans.map((plan) => (
          <article
            key={plan.name}
            className={`rounded-xl border px-6 py-7 ${
              plan.active
                ? 'border-orange-600 bg-slate-950 text-white'
                : 'border-zinc-200 bg-[#fcfaf7] text-slate-950'
            }`}
          >
            <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">{plan.name}</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-black">{plan.price}</span>
              <span className="mb-2 text-xl font-black">zł/h</span>
            </div>
            <p className={`mt-4 text-base font-bold ${plan.active ? 'text-slate-300' : 'text-slate-500'}`}>
              {plan.lessons}
            </p>
            <p className={`mt-2 text-sm font-bold ${plan.active ? 'text-slate-400' : 'text-slate-400'}`}>
              {plan.total}
            </p>
            <button
              type="button"
              className={`mt-7 inline-flex w-full items-center justify-center rounded-md px-5 py-4 text-sm font-black transition ${
                plan.active
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'border-2 border-slate-700 text-slate-950 hover:border-slate-950'
              }`}
            >
              {plan.active ? 'Opłać teraz' : 'Zmień pakiet'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChatPanel() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Korepetytorzy</h2>
        <div className="mt-6 space-y-3">
          {['Kuba', 'Hubert'].map((name) => (
            <button
              key={name}
              type="button"
              className="flex w-full items-center gap-4 rounded-lg bg-[#fcfaf7] px-4 py-4 text-left transition hover:bg-orange-50"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                {name[0]}
              </span>
              <span>
                <span className="block text-base font-black text-slate-950">{name}</span>
                <span className="block text-sm font-semibold text-slate-500">Aktywny w panelu</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Czat z Kubą</h2>
        <div className="mt-6 space-y-4">
          {messages.map((message) => (
            <div key={`${message.author}-${message.time}`} className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-xl px-5 py-4 ${message.own ? 'bg-orange-600 text-white' : 'bg-[#fcfaf7] text-slate-700'}`}>
                <p className="text-sm font-black">{message.author} · {message.time}</p>
                <p className="mt-2 text-base font-medium leading-7">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <input
            type="text"
            placeholder="Napisz wiadomość..."
            className="h-14 min-w-0 flex-1 rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-medium outline-none focus:border-orange-600 focus:bg-white"
          />
          <button type="button" className="rounded-md bg-orange-600 px-6 text-sm font-black text-white transition hover:bg-orange-700">
            Wyślij
          </button>
        </div>
      </div>
    </section>
  );
}

function NotesPanel() {
  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <h2 className="text-2xl font-black text-slate-950">Notatki i pliki od korepetytora</h2>
      <p className="mt-2 text-base font-medium text-slate-500">
        Tu docelowo pojawią się materiały przesłane przez Kubę i Huberta.
      </p>

      <div className="mt-7 grid gap-4">
        {files.map((file) => (
          <article key={file.name} className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-[#fcfaf7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                <TabIcon type="file" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-950">{file.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {file.tutor} · {file.date} · {file.size}
                </p>
              </div>
            </div>
            <button type="button" className="rounded-md border-2 border-slate-700 px-5 py-3 text-sm font-black text-slate-950 transition hover:border-slate-950">
              Pobierz
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TabIcon({ type, className }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 3v4m10-4v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 8h2m4 0h2m-8 4h2m4 0h2" />
      </svg>
    );
  }

  if (type === 'chart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 19h16M7 16V9m5 7V5m5 11v-4M6 9l5-4 4 5 4-3" />
      </svg>
    );
  }

  if (type === 'chat') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 15H6l-3 3v-3a5 5 0 0 1-1-3.1C2 8.6 5.1 6 9 6s7 2.6 7 5.9-3.1 5.9-7 5.9c-.8 0-1.5-.1-2.2-.3M14 10c4.4 0 8 2.7 8 6 0 1.1-.4 2.1-1 3v3l-3-2.2c-1.1.2-2.2.2-3.4.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h5m-5 4h6" />
    </svg>
  );
}
