import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api.js';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'pricing', label: 'Cennik', icon: 'chart' },
  { id: 'tutors', label: 'Korepetytorzy', icon: 'tutor' },
  { id: 'chat', label: 'Czat z korepetytorem', icon: 'chat' },
  { id: 'notes', label: 'Notatki i pliki', icon: 'file' },
];

const pricingPlans = [
  { name: 'POJEDYNCZA', price: 99, lessons: '1 lekcja bez pakietu', total: '99 zł jednorazowo', tokens: 1 },
  { name: 'START', price: 89, lessons: '1 lekcja tygodniowo', total: '356 zł / miesiąc', tokens: 4 },
  { name: 'PLUS', price: 79, lessons: '2 lekcje tygodniowo', total: '632 zł / miesiąc', tokens: 8, active: true },
  { name: 'INTENSIV', price: 69, lessons: '3 lekcje tygodniowo', total: '828 zł / miesiąc', tokens: 12 },
];

const tutorProfiles = [
  {
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria Energetyki',
    year: 'III rok Politechniki',
    description:
      'Wspiera uczniów w zrozumieniu matematyki od najmłodszych lat, ale jego żywiołem są matury rozszerzone, analiza matematyczna i fizyka. Potrafi przełożyć skomplikowane twierdzenia na życiowe przykłady z termodynamiki i fizyki stosowanej.',
    tags: ['Matematyka SP i LO', 'Matura Rozszerzona', 'Analiza Matematyczna', 'Fizyka'],
  },
  {
    name: 'Norbert',
    initial: 'N',
    field: 'Matematyka i przygotowanie szkolne',
    year: 'Korepetytor NaSTOmatMa',
    description:
      'Pomaga uczniom uporządkować bieżący materiał, nadrobić zaległości i spokojnie przygotować się do sprawdzianów oraz egzaminów. Stawia na cierpliwe tłumaczenie krok po kroku i szybkie wyłapywanie miejsc, które blokują dalszą naukę.',
    tags: ['Matematyka podstawowa', 'Szkoła podstawowa', 'Liceum', 'Egzamin ósmoklasisty'],
  },
];

const calendarPastDays = 14;
const calendarFutureDays = 28;
const chatRefreshMs = 5000;
const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];

function slotKey(date, startTime) {
  return `${date}-${startTime}`;
}

function parseLocalDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`);
}

function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getWeekStart(date = new Date()) {
  const nextDate = new Date(date);
  const day = nextDate.getDay() || 7;
  nextDate.setDate(nextDate.getDate() - day + 1);
  nextDate.setHours(12, 0, 0, 0);
  return nextDate;
}

function getWeekDays(weekStart) {
  return dayLabels.map((label, index) => {
    const date = addDays(weekStart, index);
    return {
      label,
      date: String(date.getDate()),
      isoDate: formatIsoDate(date),
    };
  });
}

function isPastSlot(slot) {
  return new Date(`${slot.date}T${slot.start_time}:00`) <= new Date();
}

function isPastSlotTime(isoDate, startTime) {
  return new Date(`${isoDate}T${startTime}:00`) <= new Date();
}

function formatWeekRange(weekStart) {
  const firstDay = weekStart;
  const lastDay = addDays(weekStart, 6);
  const formatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' });

  return `${formatter.format(firstDay)} - ${formatter.format(lastDay)}`;
}

async function fetchCalendarSlots(weekStart, teacherId) {
  const teacherQuery = teacherId ? `&teacher_id=${teacherId}` : '';
  const response = await fetch(`${API_BASE_URL}/api/auth/calendar/?week_start=${formatIsoDate(weekStart)}${teacherQuery}`, {
    credentials: 'include',
  });
  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać kalendarza.');
  }

  return data;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return {};
  }

  return response.json();
}

async function fetchTeachers() {
  const response = await fetch(`${API_BASE_URL}/api/auth/teachers/`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać listy korepetytorów.');
  }

  return data.teachers;
}

async function fetchMaterials() {
  const response = await fetch(`${API_BASE_URL}/api/auth/materials/`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać materiałów.');
  }

  return data.materials;
}

async function fetchStudentChatMessages(teacherId) {
  const query = teacherId ? `?teacher_id=${teacherId}` : '';
  const response = await fetch(`${API_BASE_URL}/api/auth/chat/${query}`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać czatu.');
  }

  return data;
}

async function sendStudentChatMessage(teacherId, body) {
  const response = await fetch(`${API_BASE_URL}/api/auth/chat/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teacher_id: teacherId, body }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się wysłać wiadomości.');
  }

  return data;
}

function formatSlotDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function StudentPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('calendar');
  const [tokens, setTokens] = useState(user?.tokens ?? 0);
  const displayName = user?.full_name || user?.email || 'Uczeń';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    setTokens(user?.tokens ?? 0);
  }, [user?.tokens]);

  return (
    <section className="min-h-screen bg-[#f7f6f2]">
      <StudentHeader
        displayName={displayName}
        initial={initial}
        tokens={tokens}
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
          {activeTab === 'calendar' && (
            <CalendarPanel
              user={user}
              tokens={tokens}
              onTokensChange={setTokens}
            />
          )}
          {activeTab === 'pricing' && <PricingPanel onOpenChat={() => setActiveTab('chat')} />}
          {activeTab === 'tutors' && <TutorsPanel onOpenChat={() => setActiveTab('chat')} />}
          {activeTab === 'chat' && <ChatPanel />}
          {activeTab === 'notes' && <NotesPanel />}
        </div>
      </div>
    </section>
  );
}

function StudentHeader({ displayName, initial, tokens, onLogout }) {
  return (
    <header className="bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex min-h-24 w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <a
          href="/"
          aria-label="NaSTOmatMa panel ucznia"
          className="shrink-0 text-xl font-extrabold tracking-tight sm:text-3xl"
        >
          <span className="text-white">Na</span>
          <span className="text-orange-600">STO</span>
          <span className="text-white">mat</span>
          <span className="text-orange-600">Ma</span>
        </a>

        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-orange-500/50 bg-orange-600 px-3 py-2 text-white shadow-[0_10px_24px_rgba(159,95,44,0.28)] sm:px-4">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-100">Żetony</span>
            <span className="text-xl font-black leading-none sm:text-2xl">{tokens}</span>
          </div>
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
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
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

function CalendarPanel({ user, tokens, onTokensChange }) {
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMobileDayIso, setSelectedMobileDayIso] = useState(null);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [cancelingSlotId, setCancelingSlotId] = useState(null);
  const [slotToConfirm, setSlotToConfirm] = useState(null);
  const [slotToCancel, setSlotToCancel] = useState(null);
  const [isNoTokensModalOpen, setIsNoTokensModalOpen] = useState(false);
  const slotMap = Object.fromEntries(
    slots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
  );
  const rejectedSlot = slots.find((slot) => slot.rejected_student?.id === user?.id);
  const weekDays = getWeekDays(weekStart);
  const selectedMobileDay = weekDays.find((day) => day.isoDate === selectedMobileDayIso) ?? null;
  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;
  const minWeekStart = getWeekStart(addDays(new Date(), -calendarPastDays));
  const maxWeekStart = getWeekStart(addDays(new Date(), calendarFutureDays));
  const canGoPrevious = weekStart > minWeekStart;
  const canGoNext = weekStart < maxWeekStart;
  const hasTokens = tokens > 0;

  const loadSlots = async () => {
    if (!selectedTeacherId) {
      setSlots([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const calendarData = await fetchCalendarSlots(weekStart, selectedTeacherId);
      setSlots(calendarData.slots);
      if (typeof calendarData.tokens === 'number') {
        onTokensChange(calendarData.tokens);
      }
      setStatus({ type: null, message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [weekStart, selectedTeacherId]);

  useEffect(() => {
    let isMounted = true;

    fetchTeachers()
      .then((teachersFromApi) => {
        if (!isMounted) {
          return;
        }

        setTeachers(teachersFromApi);
        setSelectedTeacherId((currentId) => {
          if (teachersFromApi.some((teacher) => teacher.id === currentId)) {
            return currentId;
          }

          return teachersFromApi[0]?.id ?? null;
        });
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const moveWeek = (direction) => {
    setWeekStart((currentWeekStart) => addDays(currentWeekStart, direction * 7));
    setSelectedMobileDayIso(null);
  };

  const bookSlot = async (slotId) => {
    setBookingSlotId(slotId);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/book/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slot_id: slotId }),
      });
      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zarezerwować terminu.');
      }

      if (typeof data.tokens === 'number') {
        onTokensChange(data.tokens);
      }
      setStatus({ type: 'success', message: 'Termin oczekuje na akceptację przez korepetytora.' });
      const calendarData = await fetchCalendarSlots(weekStart, selectedTeacherId);
      setSlots(calendarData.slots);
      if (typeof calendarData.tokens === 'number') {
        onTokensChange(calendarData.tokens);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBookingSlotId(null);
    }
  };

  const cancelPendingSlot = async (slotId) => {
    setCancelingSlotId(slotId);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/cancel/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slot_id: slotId }),
      });
      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się anulować rezerwacji.');
      }

      if (typeof data.tokens === 'number') {
        onTokensChange(data.tokens);
      }
      setStatus({ type: 'success', message: 'Rezerwacja została anulowana. Żeton wrócił na konto.' });
      const calendarData = await fetchCalendarSlots(weekStart, selectedTeacherId);
      setSlots(calendarData.slots);
      if (typeof calendarData.tokens === 'number') {
        onTokensChange(calendarData.tokens);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setCancelingSlotId(null);
    }
  };

  const openBookingConfirm = (slot) => {
    if (!hasTokens) {
      setStatus({ type: 'error', message: 'Brak żetonów. Nie można rezerwować lekcji.' });
      setIsNoTokensModalOpen(true);
      return;
    }

    setSlotToConfirm(slot);
  };

  const openCancelConfirm = (slot) => {
    setSlotToCancel(slot);
  };

  const chooseTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setSelectedMobileDayIso(null);
    setSlotToConfirm(null);
  };

  const confirmBooking = async () => {
    if (!slotToConfirm) {
      return;
    }

    await bookSlot(slotToConfirm.id);
    setSlotToConfirm(null);
  };

  const confirmCancel = async () => {
    if (!slotToCancel) {
      return;
    }

    await cancelPendingSlot(slotToCancel.id);
    setSlotToCancel(null);
  };

  return (
    <div>
      <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Kalendarz terminów</h2>
            <p className="mt-2 text-base font-medium text-slate-500">
              Kliknij wolny termin udostępniony przez korepetytora, aby zarezerwować lekcję.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={() => moveWeek(-1)}
              className="rounded-md border-2 border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Poprzedni tydzień
            </button>
            <p className="min-w-[14rem] text-center text-sm font-black text-slate-700">
              {formatWeekRange(weekStart)}
            </p>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => moveWeek(1)}
              className="rounded-md border-2 border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Następny tydzień
            </button>
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-orange-100 bg-[#fcfaf7] px-4 py-4">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">
            Wybierz korepetytora
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => chooseTeacher(teacher.id)}
                className={`flex items-center gap-4 rounded-lg border px-4 py-4 text-left transition ${
                  teacher.id === selectedTeacherId
                    ? 'border-orange-600 bg-white shadow-[0_10px_24px_rgba(159,95,44,0.12)]'
                    : 'border-zinc-200 bg-white/70 hover:border-orange-300 hover:bg-white'
                }`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                  {teacher.initial}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-black text-slate-950">{teacher.name}</span>
                  <span className="block truncate text-sm font-semibold text-slate-500">
                    {teacher.id === selectedTeacherId ? 'Pokazujesz wolne terminy' : 'Pokaż wolne terminy'}
                  </span>
                </span>
              </button>
            ))}

            {teachers.length === 0 && (
              <p className="rounded-lg bg-white px-4 py-4 text-sm font-bold text-slate-500">
                Brak dostępnych korepetytorów.
              </p>
            )}
          </div>
        </div>

        {status.message && (
          <p
            className={`mt-5 rounded-md px-4 py-3 text-sm font-bold ${
              status.type === 'success' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {status.message}
          </p>
        )}

        {rejectedSlot && (
          <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Niestety korepetycje nie zostały zarezerwowane w dniu {formatSlotDate(rejectedSlot.date)}, godz. {rejectedSlot.start_time}. Spróbuj inny termin lub skonsultuj się z korepetytorem.
          </p>
        )}

        {selectedTeacher && (
          <p className="mt-5 rounded-md bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
            Wyświetlasz terminy: {selectedTeacher.name}
          </p>
        )}

        <div className="mt-7 lg:hidden">
          {!selectedMobileDay ? (
            <div className="grid gap-3">
              {weekDays.map((day) => {
                const daySlots = hours
                  .map((hour) => slotMap[slotKey(day.isoDate, hour.padStart(5, '0'))])
                  .filter(Boolean);
                const availableCount = daySlots.filter((slot) => (
                  slot.status === 'available' && !isPastSlot(slot) && slot.rejected_student?.id !== user?.id
                )).length;
                const ownPendingCount = daySlots.filter((slot) => (
                  slot.status === 'pending' && slot.student?.id === user?.id
                )).length;
                const ownBookedCount = daySlots.filter((slot) => (
                  slot.status === 'booked' && slot.student?.id === user?.id
                )).length;
                const isPastDay = parseLocalDate(day.isoDate) < parseLocalDate(formatIsoDate(new Date()));

                return (
                  <button
                    key={day.isoDate}
                    type="button"
                    onClick={() => setSelectedMobileDayIso(day.isoDate)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-4 text-left text-slate-950 shadow-[0_10px_24px_rgba(39,40,45,0.05)] transition hover:border-orange-300 hover:bg-orange-50/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className={`text-lg font-black ${isPastDay ? 'text-slate-400' : 'text-slate-950'}`}>
                          {day.label}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-400">{day.date}</p>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${isPastDay ? 'bg-slate-300' : 'bg-orange-600'}`} />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-black">
                      <span className="rounded-full bg-orange-50 px-3 py-1.5 text-orange-700">
                        {availableCount} wolne
                      </span>
                      {ownPendingCount > 0 && (
                        <span className="rounded-full bg-orange-500 px-3 py-1.5 text-white">
                          {ownPendingCount} oczekuje
                        </span>
                      )}
                      {ownBookedCount > 0 && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-emerald-800">
                          {ownBookedCount} zaakcept.
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setSelectedMobileDayIso(null)}
                className="inline-flex items-center gap-2 rounded-md border-2 border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-slate-700"
              >
                <span aria-hidden="true">&larr;</span>
                Daty
              </button>

              <div className="mt-5 rounded-xl border border-zinc-200 bg-[#f1eee8] px-4 py-4 text-center">
                <p className="text-xl font-black text-slate-950">{selectedMobileDay.label}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{selectedMobileDay.date}</p>
                <span className="mx-auto mt-2 block h-1.5 w-1.5 rounded-full bg-orange-600" />
              </div>

              <div className="mt-4 grid gap-3">
                {hours.map((hour) => {
                  const startTime = hour.padStart(5, '0');
                  const slot = slotMap[slotKey(selectedMobileDay.isoDate, startTime)];
                  const isRejectedForStudent = slot?.rejected_student?.id === user?.id;
                  const isAvailable = slot?.status === 'available' && !isPastSlot(slot) && !isRejectedForStudent;
                  const isPendingForStudent = slot?.status === 'pending' && slot.student?.id === user?.id;
                  const isBookedForStudent = slot?.status === 'booked' && slot.student?.id === user?.id;
                  const isPast = isPastSlotTime(selectedMobileDay.isoDate, startTime);

                  return (
                    <div
                      key={`${selectedMobileDay.isoDate}-${startTime}`}
                      className={`rounded-xl border px-4 py-4 ${
                        isAvailable
                          ? 'border-orange-100 bg-orange-50 text-orange-700'
                          : isPendingForStudent
                            ? 'border-orange-500 bg-orange-500 text-white'
                          : isBookedForStudent
                            ? 'border-emerald-100 bg-emerald-100 text-emerald-800'
                          : isPast
                            ? 'border-zinc-200 bg-zinc-100 text-slate-300'
                            : 'border-zinc-200 bg-white text-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black">
                            {hour.split(':')[0]}:00-{Number(hour.split(':')[0]) + 1}:00
                          </p>
                          <p className={`mt-1 text-xs font-bold ${
                            isPendingForStudent || isBookedForStudent ? '' : 'text-slate-400'
                          }`}>
                            {isAvailable
                              ? 'Wolny termin'
                              : isPendingForStudent
                                ? 'Oczekuje na akceptację'
                              : isBookedForStudent
                                ? 'Rezerwacja zaakceptowana'
                              : isRejectedForStudent
                                ? 'Odrzucono rezerwację'
                              : isPast
                                ? 'Termin minął'
                              : 'Brak dostępności'}
                          </p>
                          {slot?.teacher?.name && (isAvailable || isPendingForStudent || isBookedForStudent) && (
                            <p className="mt-2 text-sm font-black">
                              {slot.teacher.name}
                            </p>
                          )}
                        </div>
                      </div>

                      {isAvailable && (
                        <button
                          type="button"
                          disabled={bookingSlotId === slot?.id || isLoading}
                          onClick={() => openBookingConfirm(slot)}
                          className="mt-4 w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {bookingSlotId === slot.id ? 'Rezerwuję...' : 'Zarezerwuj'}
                        </button>
                      )}
                      {isPendingForStudent && (
                        <button
                          type="button"
                          disabled={cancelingSlotId === slot?.id || isLoading}
                          onClick={() => openCancelConfirm(slot)}
                          className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-black text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {cancelingSlotId === slot.id ? 'Anuluję...' : 'Anuluj rezerwację'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-7 hidden overflow-x-auto lg:block">
          <div className="min-w-[860px] overflow-hidden rounded-xl border border-zinc-200">
            <div className="grid grid-cols-[72px_repeat(7,1fr)] bg-[#f1eee8]">
              <div className="border-r border-zinc-200 px-3 py-4" />
              {weekDays.map((day) => {
                const isPastDay = parseLocalDate(day.isoDate) < parseLocalDate(formatIsoDate(new Date()));

                return (
                  <div key={day.isoDate} className={`border-r border-zinc-200 px-3 py-4 text-center last:border-r-0 ${isPastDay ? 'bg-zinc-100 text-slate-400' : ''}`}>
                    <p className={`text-base font-black ${isPastDay ? 'text-slate-400' : 'text-slate-800'}`}>{day.label}</p>
                    <p className="text-sm font-bold text-slate-400">{day.date}</p>
                    <span className={`mx-auto mt-2 block h-1.5 w-1.5 rounded-full ${isPastDay ? 'bg-slate-300' : 'bg-orange-600'}`} />
                  </div>
                );
              })}
            </div>

            {hours.map((hour) => (
              <div key={hour} className="grid min-h-[56px] grid-cols-[72px_repeat(7,1fr)] border-t border-zinc-200">
                <div className="border-r border-zinc-200 bg-white px-3 py-4 text-sm font-semibold text-slate-400">
                  {hour}
                </div>
                {weekDays.map((day) => {
                  const startTime = hour.padStart(5, '0');
                  const slot = slotMap[slotKey(day.isoDate, startTime)];
                  const isRejectedForStudent = slot?.rejected_student?.id === user?.id;
                  const isAvailable = slot?.status === 'available' && !isPastSlot(slot) && !isRejectedForStudent;
                  const isPendingForStudent = slot?.status === 'pending' && slot.student?.id === user?.id;
                  const isBookedForStudent = slot?.status === 'booked' && slot.student?.id === user?.id;
                  const isPast = isPastSlotTime(day.isoDate, startTime);

                  return (
                    <button
                      key={`${day.isoDate}-${startTime}`}
                      type="button"
                      disabled={(!isAvailable && !isPendingForStudent) || bookingSlotId === slot?.id || cancelingSlotId === slot?.id || isLoading}
                      title={
                        isPendingForStudent
                          ? 'Oczekiwanie na akceptację przez korepetytora'
                          : isBookedForStudent
                            ? 'Rezerwacja zaakceptowana'
                            : undefined
                      }
                      onClick={() => {
                        if (isAvailable) {
                          openBookingConfirm(slot);
                        } else if (isPendingForStudent) {
                          openCancelConfirm(slot);
                        }
                      }}
                      className={`min-h-[56px] border-r border-zinc-200 px-2 py-2 text-center text-xs font-black transition last:border-r-0 ${
                        isAvailable
                          ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                          : isPendingForStudent
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : isBookedForStudent
                            ? 'bg-emerald-100 text-emerald-800'
                          : isPast
                            ? 'bg-zinc-100 text-slate-300'
                            : 'bg-white text-transparent'
                      } disabled:cursor-not-allowed`}
                    >
                      {isAvailable || isPendingForStudent || isBookedForStudent ? (
                        bookingSlotId === slot.id
                          ? 'Rezerwuję...'
                          : cancelingSlotId === slot.id
                            ? 'Anuluję...'
                            : `${hour.split(':')[0]}-${Number(hour.split(':')[0]) + 1}`
                      ) : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {slotToConfirm && (
        <ConfirmBookingModal
          slot={slotToConfirm}
          onCancel={() => setSlotToConfirm(null)}
          onConfirm={confirmBooking}
        />
      )}

      {slotToCancel && (
        <CancelBookingModal
          slot={slotToCancel}
          onCancel={() => setSlotToCancel(null)}
          onConfirm={confirmCancel}
        />
      )}

      {isNoTokensModalOpen && (
        <NoTokensModal onClose={() => setIsNoTokensModalOpen(false)} />
      )}

    </div>
  );
}

function ConfirmBookingModal({ slot, onCancel, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-black text-slate-950">Zarezerwować korepetycje?</h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          Czy na pewno chcesz zarezerwować korepetycje na {formatSlotDate(slot.date)}, godz. {slot.start_time}?
        </p>
        <p className="mt-3 rounded-md bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          Po wysłaniu prośby pobierzemy 1 żeton. Jeśli korepetytor odrzuci termin, żeton wróci na konto.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border-2 border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-700"
          >
            Anuluj
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Wysyłam...' : 'Tak'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelBookingModal({ slot, onCancel, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-black text-slate-950">Anulować rezerwację?</h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          Anulujesz oczekującą rezerwację na {formatSlotDate(slot.date)}, godz. {slot.start_time}.
        </p>
        <p className="mt-3 rounded-md bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          Po anulowaniu 1 żeton wróci na Twoje konto.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border-2 border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-700"
          >
            Zostaw
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Anuluję...' : 'Anuluj'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NoTokensModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/55 px-5 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-black text-slate-950">Brak żetonów</h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          Nie można zarezerwować lekcji bez dostępnych żetonów.
        </p>
        <p className="mt-3 rounded-md bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">
          Skontaktuj się z korepetytorem po płatności, aby dodał żetony do Twojego konta.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700"
        >
          Rozumiem
        </button>
      </div>
    </div>
  );
}

function TutorsPanel({ onOpenChat }) {
  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Korepetytorzy</h2>
          <p className="mt-2 max-w-3xl text-base font-medium leading-7 text-slate-500">
            Poznaj korepetytorów NaSTOmatMa i wybierz osobę najlepiej dopasowaną do aktualnych potrzeb.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenChat}
          className="inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700"
        >
          Wyślij wiadomość
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {tutorProfiles.map((tutor) => (
          <article key={tutor.name} className="rounded-xl border border-orange-100 bg-[#fcfaf7] px-6 py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-orange-600 text-3xl font-black text-white shadow-[0_10px_24px_rgba(159,95,44,0.22)]">
                {tutor.initial}
              </span>
              <div>
                <h3 className="text-3xl font-black text-slate-950">{tutor.name}</h3>
                <p className="mt-2 text-base font-black text-orange-600">{tutor.field}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{tutor.year}</p>
              </div>
            </div>

            <p className="mt-6 text-base font-medium leading-7 text-slate-600">
              {tutor.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {tutor.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-white px-3 py-2 text-xs font-black text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <TutorContactCard
          title="Email"
          value="nastomatma@gmail.com"
          href="mailto:nastomatma@gmail.com"
        />
        <TutorContactCard
          title="Messenger / WhatsApp"
          value="Szybki i bezpośredni kontakt"
          href="#"
        />
        <button
          type="button"
          onClick={onOpenChat}
          className="rounded-xl border border-orange-100 bg-orange-600 px-5 py-5 text-left text-white shadow-[0_14px_32px_rgba(159,95,44,0.16)] transition hover:bg-orange-700"
        >
          <span className="block text-base font-black">Czat w panelu</span>
          <span className="mt-2 block text-sm font-semibold text-orange-100">
            Napisz do wybranego korepetytora bezpośrednio w aplikacji.
          </span>
        </button>
      </div>
    </section>
  );
}

function TutorContactCard({ title, value, href }) {
  return (
    <a
      href={href}
      className="rounded-xl border border-orange-100 bg-[#fcfaf7] px-5 py-5 transition hover:border-orange-300 hover:bg-orange-50"
    >
      <span className="block text-base font-black text-slate-950">{title}</span>
      <span className="mt-2 block text-sm font-semibold leading-6 text-slate-500">{value}</span>
    </a>
  );
}

function PricingPanel({ onOpenChat }) {
  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Cennik lekcji</h2>
          <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">
            Wybierz wariant i skontaktuj się z korepetytorem, aby ustalić płatność. Po zaksięgowaniu otrzymasz żetony do rezerwacji lekcji.
          </p>
        </div>
        <p className="rounded-md bg-orange-50 px-4 py-3 text-sm font-black text-orange-600">
          1 żeton = 1 lekcja
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan) => (
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
            <p className={`mt-5 rounded-md px-4 py-3 text-sm font-black ${
              plan.active ? 'bg-white/10 text-orange-200' : 'bg-orange-50 text-orange-700'
            }`}>
              Po płatności: {plan.tokens} {plan.tokens === 1 ? 'żeton' : 'żetonów'}
            </p>
            <button
              type="button"
              onClick={onOpenChat}
              className={`mt-7 inline-flex w-full items-center justify-center rounded-md px-5 py-4 text-sm font-black transition ${
                plan.active
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'border-2 border-slate-700 text-slate-950 hover:border-slate-950'
                }`}
            >
              Wyślij wiadomość
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChatPanel() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  useEffect(() => {
    let isMounted = true;

    const loadTeachers = () => {
      fetchTeachers().then((teachersFromApi) => {
        if (!isMounted) {
          return;
        }

        setTeachers(teachersFromApi);
        setSelectedTeacherId((currentId) => {
          if (teachersFromApi.some((teacher) => teacher.id === currentId)) {
            return currentId;
          }

          return teachersFromApi[0]?.id ?? null;
        });
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      });
    };

    loadTeachers();
    const intervalId = window.setInterval(loadTeachers, chatRefreshMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!selectedTeacherId) {
      setChatMessages([]);
      return undefined;
    }

    let isMounted = true;
    const loadMessages = () => {
      fetchStudentChatMessages(selectedTeacherId).then((data) => {
        if (isMounted) {
          setChatMessages(data.messages);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      });
    };

    loadMessages();
    const intervalId = window.setInterval(loadMessages, chatRefreshMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [selectedTeacherId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedTeacherId || !draftMessage.trim()) {
      return;
    }

    try {
      const data = await sendStudentChatMessage(selectedTeacherId, draftMessage.trim());
      setChatMessages(data.messages);
      setDraftMessage('');
      setStatus({ type: null, message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Korepetytorzy</h2>
        <div className="mt-6 space-y-3">
          {teachers.length === 0 && (
            <p className="rounded-lg bg-[#fcfaf7] px-4 py-4 text-sm font-bold text-slate-500">
              Brak korepetytorów w bazie.
            </p>
          )}

          {teachers.map((teacher) => (
            <button
              key={teacher.id}
              type="button"
              onClick={() => setSelectedTeacherId(teacher.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left transition ${
                teacher.id === selectedTeacherId ? 'bg-orange-50' : 'bg-[#fcfaf7] hover:bg-orange-50'
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                {teacher.initial}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-950">{teacher.name}</span>
                <span className="block truncate text-sm font-semibold text-slate-500">{teacher.last_message}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">
          {selectedTeacher ? `Czat z ${selectedTeacher.name}` : 'Czat'}
        </h2>

        {status.message && (
          <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {status.message}
          </p>
        )}

        <div className="mt-6 space-y-4">
          {selectedTeacher && chatMessages.length === 0 && (
            <p className="rounded-lg bg-[#fcfaf7] px-5 py-5 text-sm font-bold text-slate-500">
              Brak wiadomości.
            </p>
          )}

          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-xl px-5 py-4 ${message.own ? 'bg-orange-600 text-white' : 'bg-[#fcfaf7] text-slate-700'}`}>
                <p className="text-sm font-black">{message.author} · {message.time}</p>
                <p className="mt-2 text-base font-medium leading-7">{message.body}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="mt-6 flex gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Napisz wiadomość..."
            disabled={!selectedTeacher}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            className="h-14 min-w-0 flex-1 rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-medium outline-none focus:border-orange-600 focus:bg-white"
          />
          <button type="submit" disabled={!selectedTeacher} className="rounded-md bg-orange-600 px-6 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            Wyślij
          </button>
        </form>
      </div>
    </section>
  );
}

function NotesPanel() {
  const [materials, setMaterials] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchMaterials()
      .then((nextMaterials) => {
        if (isMounted) {
          setMaterials(nextMaterials);
          setStatus({ type: null, message: '' });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <h2 className="text-2xl font-black text-slate-950">Notatki i pliki od korepetytora</h2>
      <p className="mt-2 text-base font-medium text-slate-500">
        Tutaj znajdziesz materiały przesłane przez korepetytora.
      </p>

      {status.message && (
        <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {status.message}
        </p>
      )}

      <div className="mt-7 grid gap-4">
        {isLoading && (
          <p className="rounded-lg bg-[#fcfaf7] px-5 py-5 text-sm font-bold text-slate-500">
            Ładowanie materiałów...
          </p>
        )}

        {!isLoading && materials.length === 0 && (
          <p className="rounded-lg bg-[#fcfaf7] px-5 py-5 text-sm font-bold text-slate-500">
            Nie masz jeszcze przesłanych materiałów.
          </p>
        )}

        {materials.map((material) => (
          <article key={material.id} className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-[#fcfaf7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                <TabIcon type="file" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-950">{material.title}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {material.teacher} · {material.created_at} · {formatFileSize(material.size)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-400">{material.filename}</p>
                {material.message && (
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">
                    {material.message}
                  </p>
                )}
              </div>
            </div>
            <a
              href={`${API_BASE_URL}${material.download_url}`}
              className="inline-flex items-center justify-center rounded-md border-2 border-slate-700 px-5 py-3 text-sm font-black text-slate-950 transition hover:border-slate-950"
            >
              Pobierz
            </a>
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

  if (type === 'tutor') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 20v-1.5c0-2.5-2.2-4.5-5-4.5s-5 2-5 4.5V20m8-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2.5 9.5a4.5 4.5 0 1 0 6 6M17 19l1.4 1.4 3-3.3" />
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
