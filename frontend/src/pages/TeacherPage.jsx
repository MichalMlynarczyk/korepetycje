import { useState } from 'react';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'students', label: 'Uczniowie i czat', icon: 'chat' },
  { id: 'files', label: 'Wyślij pliki', icon: 'file' },
];

const students = [
  { id: 'ania', name: 'Ania Kowalska', level: 'Matura podstawowa', lastMessage: 'Dziękuję za notatkę z geometrii.' },
  { id: 'jan', name: 'Jan Nowak', level: 'Klasa 7', lastMessage: 'Czy mogę zarezerwować środę?' },
  { id: 'ola', name: 'Ola Zielińska', level: 'Matura rozszerzona', lastMessage: 'Przesyłam zadania do sprawdzenia.' },
  { id: 'michal', name: 'Michał Wiśniewski', level: 'Klasa 4-6', lastMessage: 'Do zobaczenia na lekcji.' },
];

const weekDays = [
  { label: 'Pon', date: '15' },
  { label: 'Wt', date: '16' },
  { label: 'Śr', date: '17' },
  { label: 'Czw', date: '18' },
  { label: 'Pt', date: '19' },
  { label: 'Sob', date: '20' },
  { label: 'Niedz', date: '21' },
];

const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const initialSlots = {
  '0-7': 'available',
  '0-8': 'available',
  '1-6': 'available',
  '1-7': 'booked',
  '1-8': 'available',
  '1-9': 'available',
  '2-9': 'available',
  '2-10': 'available',
  '4-6': 'available',
  '4-7': 'available',
  '4-8': 'booked',
  '5-0': 'available',
  '5-1': 'available',
  '5-2': 'available',
  '5-4': 'available',
};

const statusMeta = {
  available: {
    label: 'Jestem dostępny',
    className: 'bg-orange-50 text-orange-700 ring-orange-100',
  },
  booked: {
    label: 'Już zajęte',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
};

const chatMessages = [
  { author: 'Ania Kowalska', text: 'Czy możemy na kolejnej lekcji powtórzyć równania?', time: '09:20' },
  { author: 'Ty', text: 'Tak, przygotuję krótki zestaw zadań i wrzucę go w plikach.', time: '09:24', own: true },
  { author: 'Ania Kowalska', text: 'Super, dziękuję!', time: '09:26' },
];

export function TeacherPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const displayName = user?.full_name || user?.email || 'Nauczyciel';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'N';

  return (
    <section className="min-h-screen bg-[#f7f6f2]">
      <TeacherHeader
        displayName={displayName}
        initial={initial}
        onLogout={onLogout}
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-600">
          Panel nauczyciela
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
          Cześć, {displayName.split(' ')[0] || 'nauczycielu'}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-500">
          Zarządzaj dostępnością, rozmawiaj z uczniami i przesyłaj materiały po lekcjach.
        </p>

        <TeacherTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-8">
          {activeTab === 'calendar' && <TeacherCalendar />}
          {activeTab === 'students' && <StudentsPanel />}
          {activeTab === 'files' && <FilesPanel />}
        </div>
      </div>
    </section>
  );
}

function TeacherHeader({ displayName, initial, onLogout }) {
  return (
    <header className="bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        <a
          href="/"
          aria-label="NaSTOmatMa panel nauczyciela"
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
            <p className="text-base font-black">Nauczyciel</p>
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

function TeacherTabs({ activeTab, onChange }) {
  return (
    <div className="mt-10 rounded-lg bg-[#e9e6df] p-2">
      <div className="grid gap-2 md:grid-cols-3">
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
              <TeacherIcon type={tab.icon} className="h-6 w-6 shrink-0 text-orange-600" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TeacherCalendar() {
  const [slots, setSlots] = useState(initialSlots);

  const toggleSlot = (key) => {
    setSlots((current) => {
      const currentStatus = current[key];

      if (!currentStatus) {
        return {
          ...current,
          [key]: 'available',
        };
      }

      if (currentStatus === 'available') {
        return {
          ...current,
          [key]: 'booked',
        };
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  return (
    <section className="rounded-xl border border-orange-100 bg-white px-4 py-6 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Kalendarz dostępności</h2>
          <p className="mt-2 text-base font-medium text-slate-500">
            Kliknij slot: pusty, dostępny, zajęty, pusty. Uczniowie będą mogli rezerwować dostępne terminy.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
          <LegendDot className="bg-orange-50 ring-orange-100" label="Jestem dostępny" />
          <LegendDot className="bg-emerald-50 ring-emerald-100" label="Już zarezerwowane" />
        </div>
      </div>

      <div className="mt-7 overflow-x-auto">
        <div className="min-w-[980px] overflow-hidden rounded-xl border border-zinc-200">
          <div className="grid grid-cols-[72px_repeat(7,1fr)] bg-[#f1eee8]">
            <div className="border-r border-zinc-200 px-3 py-4" />
            {weekDays.map((day) => (
              <div key={day.label} className="border-r border-zinc-200 px-3 py-4 text-center last:border-r-0">
                <p className="text-base font-black text-slate-800">{day.label}</p>
                <p className="text-sm font-bold text-slate-400">{day.date}</p>
                <span className="mx-auto mt-2 block h-1.5 w-1.5 rounded-full bg-orange-600" />
              </div>
            ))}
          </div>

          {hours.map((hour, hourIndex) => (
            <div key={hour} className="grid min-h-[56px] grid-cols-[72px_repeat(7,1fr)] border-t border-zinc-200">
              <div className="border-r border-zinc-200 bg-white px-3 py-4 text-sm font-semibold text-slate-400">
                {hour}
              </div>
              {weekDays.map((day, dayIndex) => {
                const key = `${dayIndex}-${hourIndex}`;
                const status = slots[key];
                const meta = status ? statusMeta[status] : null;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSlot(key)}
                    className={`border-r border-zinc-200 px-2 py-2 text-center text-xs font-black transition last:border-r-0 ${
                      meta ? meta.className : 'bg-white text-transparent hover:bg-orange-50/50 hover:text-orange-600'
                    }`}
                  >
                    {status ? `${hour.split(':')[0]}-${Number(hour.split(':')[0]) + 1}` : 'Dodaj'}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentsPanel() {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? students[0];

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Lista uczniów</h2>
        <p className="mt-2 text-base font-medium text-slate-500">
          Admin/nauczyciel widzi od razu wszystkich uczniów.
        </p>

        <div className="mt-6 space-y-3">
          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => setSelectedStudentId(student.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left transition ${
                student.id === selectedStudentId ? 'bg-orange-50' : 'bg-[#fcfaf7] hover:bg-orange-50/70'
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                {student.name[0]}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-950">{student.name}</span>
                <span className="block truncate text-sm font-semibold text-slate-500">{student.level}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Czat: {selectedStudent.name}</h2>
        <p className="mt-2 text-base font-medium text-slate-500">{selectedStudent.lastMessage}</p>

        <div className="mt-6 space-y-4">
          {chatMessages.map((message) => (
            <div key={`${message.author}-${message.time}`} className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-xl px-5 py-4 ${message.own ? 'bg-orange-600 text-white' : 'bg-[#fcfaf7] text-slate-700'}`}>
                <p className="text-sm font-black">{message.own ? 'Ty' : selectedStudent.name} · {message.time}</p>
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

function FilesPanel() {
  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <h2 className="text-2xl font-black text-slate-950">Wyślij pliki uczniowi</h2>
      <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">
        Wybierz ucznia z listy, dodaj plik i wpisz krótki opis materiału. Docelowo plik pojawi się u ucznia w zakładce notatek.
      </p>

      <form className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-base font-black text-slate-800">Uczeń</span>
            <select className="h-14 w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-bold text-slate-700 outline-none focus:border-orange-600 focus:bg-white">
              {students.map((student) => (
                <option key={student.id}>{student.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-base font-black text-slate-800">Tytuł materiału</span>
            <input
              type="text"
              placeholder="Np. Funkcja liniowa - zadania"
              className="h-14 w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-medium outline-none focus:border-orange-600 focus:bg-white"
            />
          </label>
        </div>

        <div className="rounded-xl border-2 border-dashed border-orange-200 bg-[#fcfaf7] px-6 py-7">
          <div className="flex h-full min-h-[190px] flex-col items-center justify-center text-center">
            <TeacherIcon type="file" className="h-12 w-12 text-orange-600" />
            <p className="mt-4 text-xl font-black text-slate-950">Przeciągnij plik albo wybierz z dysku</p>
            <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
              PDF, DOCX, PNG lub JPG. Na razie to warstwa UI, gotowa pod podpięcie uploadu.
            </p>
            <input type="file" className="mt-6 block w-full max-w-sm text-sm font-bold text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-5 file:py-3 file:text-sm file:font-black file:text-white" />
          </div>
        </div>

        <div className="xl:col-span-2">
          <label className="block">
            <span className="mb-2 block text-base font-black text-slate-800">Wiadomość do ucznia</span>
            <textarea
              rows="4"
              placeholder="Krótki opis pliku albo zadanie do wykonania..."
              className="w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 py-4 text-base font-medium outline-none focus:border-orange-600 focus:bg-white"
            />
          </label>

          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-orange-600 px-6 py-5 text-base font-black text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700 sm:w-auto">
            Wyślij materiał
          </button>
        </div>
      </form>
    </section>
  );
}

function LegendDot({ className, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 rounded ring-1 ${className}`} />
      {label}
    </span>
  );
}

function TeacherIcon({ type, className }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 3v4m10-4v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 8h2m4 0h2m-8 4h2m4 0h2" />
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
