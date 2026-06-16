import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api.js';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'payments', label: 'Płatności', icon: 'chart' },
  { id: 'chat', label: 'Czat z korepetytorem', icon: 'chat' },
  { id: 'notes', label: 'Notatki i pliki', icon: 'file' },
];

const paymentPlans = [
  { name: 'START', price: 99, lessons: '1 lekcja tygodniowo', total: '396 zł / miesiąc' },
  { name: 'PLUS', price: 89, lessons: '2 lekcje tygodniowo', total: '712 zł / miesiąc', active: true },
  { name: 'INTENSIV', price: 79, lessons: '3 lekcje tygodniowo', total: '948 zł / miesiąc' },
];

const files = [
  { name: 'Funkcja kwadratowa - notatka.pdf', tutor: 'Kuba', date: '18 czerwca', size: '1.2 MB' },
  { name: 'Geometria - zadania do powtórki.pdf', tutor: 'Hubert', date: '16 czerwca', size: '840 KB' },
  { name: 'Plan przygotowania do matury.docx', tutor: 'Kuba', date: '12 czerwca', size: '320 KB' },
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

async function fetchCalendarSlots(weekStart) {
  const response = await fetch(`${API_BASE_URL}/api/auth/calendar/?week_start=${formatIsoDate(weekStart)}`, {
    credentials: 'include',
  });
  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać kalendarza.');
  }

  return data.slots;
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
          {activeTab === 'calendar' && <CalendarPanel user={user} />}
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

function CalendarPanel({ user }) {
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [slotToConfirm, setSlotToConfirm] = useState(null);
  const slotMap = Object.fromEntries(
    slots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
  );
  const rejectedSlot = slots.find((slot) => slot.rejected_student?.id === user?.id);
  const nextBookedSlot = slots.find((slot) => slot.status === 'booked' && slot.student?.id === user?.id);
  const weekDays = getWeekDays(weekStart);
  const minWeekStart = getWeekStart(addDays(new Date(), -calendarPastDays));
  const maxWeekStart = getWeekStart(addDays(new Date(), calendarFutureDays));
  const canGoPrevious = weekStart > minWeekStart;
  const canGoNext = weekStart < maxWeekStart;

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(nextSlots);
      setStatus({ type: null, message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [weekStart]);

  const moveWeek = (direction) => {
    setWeekStart((currentWeekStart) => addDays(currentWeekStart, direction * 7));
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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zarezerwować terminu.');
      }

      setStatus({ type: 'success', message: 'Termin oczekuje na akceptację przez korepetytora.' });
      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(nextSlots);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBookingSlotId(null);
    }
  };

  const openBookingConfirm = (slot) => {
    setSlotToConfirm(slot);
  };

  const confirmBooking = async () => {
    if (!slotToConfirm) {
      return;
    }

    await bookSlot(slotToConfirm.id);
    setSlotToConfirm(null);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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

        <div className="mt-7 overflow-x-auto">
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
                      disabled={!isAvailable || bookingSlotId === slot?.id || isLoading}
                      title={
                        isPendingForStudent
                          ? 'Oczekiwanie na akceptację przez korepetytora'
                          : isBookedForStudent
                            ? 'Rezerwacja zaakceptowana'
                            : undefined
                      }
                      onClick={() => isAvailable && openBookingConfirm(slot)}
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

      <section className="rounded-xl bg-slate-950 px-6 py-7 text-white shadow-[0_16px_36px_rgba(39,40,45,0.12)] sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-orange-500">Najbliższa lekcja</p>
        <h2 className="mt-4 text-3xl font-black">
          {nextBookedSlot ? `${formatSlotDate(nextBookedSlot.date)}, ${nextBookedSlot.start_time}` : 'Brak rezerwacji'}
        </h2>
        <p className="mt-3 text-base font-medium leading-7 text-slate-300">
          {nextBookedSlot
            ? `Matematyka z ${nextBookedSlot.teacher.name}. Link do spotkania pojawi się 15 minut przed lekcją.`
            : 'Zarezerwuj termin z listy, a pojawi się tutaj jako najbliższa lekcja.'}
        </p>
        <div className="mt-8 rounded-lg border border-white/10 bg-white/5 px-5 py-5">
          <p className="text-sm font-bold text-slate-400">Status</p>
          <p className="mt-2 text-xl font-black text-orange-500">
            {nextBookedSlot ? 'Zarezerwowana' : 'Oczekuje na wybór'}
          </p>
        </div>
      </section>
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
