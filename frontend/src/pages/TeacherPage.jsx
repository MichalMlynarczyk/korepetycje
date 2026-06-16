import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../api.js';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'students', label: 'Uczniowie i czat', icon: 'chat' },
  { id: 'files', label: 'Wyślij pliki', icon: 'file' },
];

const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
const calendarPastDays = 14;
const calendarFutureDays = 28;
const chatRefreshMs = 5000;

const statusMeta = {
  available: {
    label: 'Jestem dostępny',
    className: 'bg-orange-50 text-orange-700 ring-orange-100',
  },
  booked: {
    label: 'Już zajęte',
    className: 'bg-rose-950 text-red-100 ring-rose-900',
  },
};

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

function isPastSlot(isoDate, startTime) {
  return new Date(`${isoDate}T${startTime}:00`) <= new Date();
}

function isOutsideCalendarWindow(isoDate) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const minDate = addDays(today, -calendarPastDays);
  const maxDate = addDays(today, calendarFutureDays);
  const date = parseLocalDate(isoDate);

  return date < minDate || date > maxDate;
}

function formatWeekRange(weekDays) {
  const firstDay = parseLocalDate(weekDays[0].isoDate);
  const lastDay = parseLocalDate(weekDays[6].isoDate);
  const formatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' });

  return `${formatter.format(firstDay)} - ${formatter.format(lastDay)}`;
}

async function fetchCalendarSlots(weekStart) {
  const response = await fetch(`${API_BASE_URL}/api/auth/calendar/?week_start=${formatIsoDate(weekStart)}`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać kalendarza.');
  }

  return data.slots;
}

async function fetchStudents() {
  const response = await fetch(`${API_BASE_URL}/api/auth/students/`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać listy uczniów.');
  }

  return data.students;
}

async function fetchChatMessages(studentId) {
  const response = await fetch(`${API_BASE_URL}/api/auth/chat/${studentId}/`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać czatu.');
  }

  return data;
}

async function sendChatMessage(studentId, body) {
  const response = await fetch(`${API_BASE_URL}/api/auth/chat/${studentId}/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się wysłać wiadomości.');
  }

  return data;
}

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
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [slots, setSlots] = useState({});
  const [databaseStudents, setDatabaseStudents] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [reservationSlot, setReservationSlot] = useState(null);
  const [pendingDecisionSlot, setPendingDecisionSlot] = useState(null);
  const clickTimerRef = useRef(null);
  const weekDays = getWeekDays(weekStart);
  const minWeekStart = getWeekStart(addDays(new Date(), -calendarPastDays));
  const maxWeekStart = getWeekStart(addDays(new Date(), calendarFutureDays));
  const canGoPrevious = weekStart > minWeekStart;
  const canGoNext = weekStart < maxWeekStart;

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(Object.fromEntries(
        nextSlots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
      ));
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

  useEffect(() => {
    let isMounted = true;

    fetchStudents()
      .then((nextStudents) => {
        if (isMounted) {
          setDatabaseStudents(nextStudents);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      });

    return () => {
      isMounted = false;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const moveWeek = (direction) => {
    setWeekStart((currentWeekStart) => addDays(currentWeekStart, direction * 7));
  };

  const toggleSlot = async (date, startTime) => {
    if (isPastSlot(date, startTime) || isOutsideCalendarWindow(date)) {
      return;
    }

    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/toggle/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, start_time: startTime }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zapisać terminu.');
      }

      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(Object.fromEntries(
        nextSlots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
      ));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const handleSlotClick = (day, startTime, slot) => {
    if (slot?.status === 'pending') {
      setPendingDecisionSlot(slot);
      return;
    }

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      toggleSlot(day.isoDate, startTime);
      clickTimerRef.current = null;
    }, 220);
  };

  const handleSlotDoubleClick = (day, startTime, slot) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    if (isPastSlot(day.isoDate, startTime) || isOutsideCalendarWindow(day.isoDate)) {
      return;
    }

    setReservationSlot({
      date: day.isoDate,
      dayLabel: day.label,
      startTime,
      endTime: `${Number(startTime.split(':')[0]) + 1}:00`,
      studentId: slot?.student?.id ? String(slot.student.id) : '',
    });
  };

  const reserveSlot = async (studentId) => {
    if (!reservationSlot) {
      return;
    }

    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/reserve/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: reservationSlot.date,
          start_time: reservationSlot.startTime,
          student_id: studentId || null,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zarezerwować terminu.');
      }

      setReservationSlot(null);
      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(Object.fromEntries(
        nextSlots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
      ));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const decidePendingSlot = async (action) => {
    if (!pendingDecisionSlot) {
      return;
    }

    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/decide/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slot_id: pendingDecisionSlot.id,
          action,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zapisać decyzji.');
      }

      setPendingDecisionSlot(null);
      const nextSlots = await fetchCalendarSlots(weekStart);
      setSlots(Object.fromEntries(
        nextSlots.map((slot) => [slotKey(slot.date, slot.start_time), slot]),
      ));
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="rounded-xl border border-orange-100 bg-white px-4 py-6 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Kalendarz dostępności</h2>
          <p className="mt-2 text-base font-medium text-slate-500">
            Kliknij slot, aby dodać lub usunąć dostępność. Zarezerwowane terminy są widoczne dla korepetytora i ucznia.
          </p>
        </div>
        <div className="flex flex-col gap-4 xl:items-end">
          <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
            <LegendDot className="bg-orange-50 ring-orange-100" label="Jestem dostępny" />
            <LegendDot className="bg-rose-950 ring-rose-900" label="Już zarezerwowane" />
            <LegendDot className="bg-zinc-100 ring-zinc-200" label="Minęło" />
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
              {formatWeekRange(weekDays)}
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
      </div>

      {status.message && (
        <p
          className={`mt-5 rounded-md px-4 py-3 text-sm font-bold ${
            status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
          }`}
        >
          {status.message}
        </p>
      )}

      <div className="mt-7 overflow-x-auto">
        <div className="min-w-[980px] overflow-hidden rounded-xl border border-zinc-200">
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

          {hours.map((hour, hourIndex) => (
            <div key={hour} className="grid min-h-[56px] grid-cols-[72px_repeat(7,1fr)] border-t border-zinc-200">
              <div className="border-r border-zinc-200 bg-white px-3 py-4 text-sm font-semibold text-slate-400">
                {hour}
              </div>
              {weekDays.map((day, dayIndex) => {
                const startTime = hour.padStart(5, '0');
                const key = slotKey(day.isoDate, startTime);
                const slot = slots[key];
                const slotStatus = slot?.status;
                const meta = slotStatus ? statusMeta[slotStatus] : null;
                const isUnavailable = isPastSlot(day.isoDate, startTime) || isOutsideCalendarWindow(day.isoDate);

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={isLoading || isUnavailable}
                    onClick={() => handleSlotClick(day, startTime, slot)}
                    onDoubleClick={() => handleSlotDoubleClick(day, startTime, slot)}
                    className={`min-h-[56px] border-r border-zinc-200 px-2 py-2 text-center text-xs font-black transition last:border-r-0 ${
                      isUnavailable
                        ? 'bg-zinc-100 text-slate-300'
                        : slotStatus === 'pending'
                          ? 'pending-reservation-pulse'
                          : meta
                          ? meta.className
                          : 'bg-white text-transparent hover:bg-orange-50/50 hover:text-orange-600'
                    } disabled:cursor-not-allowed`}
                  >
                    {slotStatus ? (
                      <span className="flex h-full min-h-[40px] flex-col items-center justify-center leading-tight">
                        <span className={slotStatus === 'booked' ? 'text-red-100' : ''}>
                          {hour.split(':')[0]}-{Number(hour.split(':')[0]) + 1}
                        </span>
                        {slotStatus === 'pending' && slot.student?.name && (
                          <span className="mt-1 max-w-full truncate text-[0.68rem] font-bold">
                            {slot.student.name}
                          </span>
                        )}
                        {slotStatus === 'booked' && slot.student?.name && (
                          <span className="mt-1 max-w-full truncate text-[0.68rem] font-bold text-red-200">
                            {slot.student.name}
                          </span>
                        )}
                      </span>
                    ) : isUnavailable ? '' : 'Dodaj'}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {reservationSlot && (
        <ReserveSlotModal
          slot={reservationSlot}
          students={databaseStudents}
          onCancel={() => setReservationSlot(null)}
          onConfirm={reserveSlot}
        />
      )}
      {pendingDecisionSlot && (
        <PendingDecisionModal
          slot={pendingDecisionSlot}
          onCancel={() => setPendingDecisionSlot(null)}
          onDecision={decidePendingSlot}
        />
      )}
    </section>
  );
}

function ReserveSlotModal({ slot, students, onCancel, onConfirm }) {
  const [selectedStudentId, setSelectedStudentId] = useState(slot.studentId ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirm(selectedStudentId);
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
        <h3 className="text-2xl font-black text-slate-950">Zarezerwować godzinę?</h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          Czy na pewno chcesz zarezerwować termin {slot.dayLabel}, {slot.startTime}-{slot.endTime}?
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-black text-slate-800">Uczeń (opcjonalnie)</span>
          <select
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
            className="h-12 w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-4 text-sm font-bold text-slate-700 outline-none focus:border-orange-600 focus:bg-white"
          >
            <option value="">Bez przypisanego ucznia</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </label>

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
            className="rounded-md bg-rose-900 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-950 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? 'Zapisuję...' : 'Tak'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingDecisionModal({ slot, onCancel, onDecision }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentName = slot.student?.name ?? 'Uczeń';

  const handleDecision = async (action) => {
    setIsSubmitting(true);
    await onDecision(action);
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
        <h3 className="text-2xl font-black text-slate-950">Prośba o rezerwację</h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          {studentName} chce zarezerwować termin {slot.start_time}-{slot.end_time}.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleDecision('reject')}
            className="rounded-md border-2 border-red-200 px-5 py-3 text-sm font-black text-red-700 transition hover:border-red-700 disabled:cursor-wait disabled:opacity-70"
          >
            Odrzuć
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleDecision('accept')}
            className="rounded-md bg-rose-900 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-950 disabled:cursor-wait disabled:opacity-70"
          >
            Zaakceptuj
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full rounded-md px-5 py-3 text-sm font-black text-slate-500 transition hover:bg-zinc-100"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

function StudentsPanel() {
  const [databaseStudents, setDatabaseStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const selectedStudent = databaseStudents.find((student) => student.id === selectedStudentId) ?? null;

  useEffect(() => {
    let isMounted = true;

    const loadStudents = () => {
      fetchStudents().then((studentsFromApi) => {
        if (!isMounted) {
          return;
        }

        setDatabaseStudents(studentsFromApi);
        setSelectedStudentId((currentId) => {
          if (studentsFromApi.some((student) => student.id === currentId)) {
            return currentId;
          }

          return studentsFromApi[0]?.id ?? null;
        });
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      });
    };

    loadStudents();
    const intervalId = window.setInterval(loadStudents, chatRefreshMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!selectedStudentId) {
      setMessages([]);
      return undefined;
    }

    let isMounted = true;
    const loadMessages = () => {
      fetchChatMessages(selectedStudentId).then((data) => {
        if (isMounted) {
          setMessages(data.messages);
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
  }, [selectedStudentId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedStudentId || !draftMessage.trim()) {
      return;
    }

    try {
      const data = await sendChatMessage(selectedStudentId, draftMessage.trim());
      setMessages(data.messages);
      setDraftMessage('');
      setStatus({ type: null, message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">Lista uczniów</h2>
        <p className="mt-2 text-base font-medium text-slate-500">
          Admin/nauczyciel widzi od razu wszystkich uczniów.
        </p>

        {status.message && (
          <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {status.message}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {databaseStudents.length === 0 && (
            <p className="rounded-lg bg-[#fcfaf7] px-4 py-4 text-sm font-bold text-slate-500">
              Brak zarejestrowanych uczniów.
            </p>
          )}

          {databaseStudents.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => setSelectedStudentId(student.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left transition ${
                student.id === selectedStudentId ? 'bg-orange-50' : 'bg-[#fcfaf7] hover:bg-orange-50/70'
              }`}
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                {student.initial}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-black text-slate-950">{student.name}</span>
                <span className="block truncate text-sm font-semibold text-slate-500">{student.email}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)]">
        <h2 className="text-2xl font-black text-slate-950">
          {selectedStudent ? `Czat: ${selectedStudent.name}` : 'Czat'}
        </h2>
        <p className="mt-2 text-base font-medium text-slate-500">
          {selectedStudent ? selectedStudent.last_message : 'Wybierz ucznia z listy.'}
        </p>

        <div className="mt-6 space-y-4">
          {selectedStudent && messages.length === 0 && (
            <p className="rounded-lg bg-[#fcfaf7] px-5 py-5 text-sm font-bold text-slate-500">
              Brak wiadomości.
            </p>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.own ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-xl px-5 py-4 ${message.own ? 'bg-orange-600 text-white' : 'bg-[#fcfaf7] text-slate-700'}`}>
                <p className="text-sm font-black">{message.own ? 'Ty' : message.author} · {message.time}</p>
                <p className="mt-2 text-base font-medium leading-7">{message.body}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="mt-6 flex gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Napisz wiadomość..."
            disabled={!selectedStudent}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            className="h-14 min-w-0 flex-1 rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-medium outline-none focus:border-orange-600 focus:bg-white"
          />
          <button type="submit" disabled={!selectedStudent} className="rounded-md bg-orange-600 px-6 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
            Wyślij
          </button>
        </form>
      </div>
    </section>
  );
}

function FilesPanel() {
  const [databaseStudents, setDatabaseStudents] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });

  useEffect(() => {
    let isMounted = true;

    fetchStudents()
      .then((studentsFromApi) => {
        if (isMounted) {
          setDatabaseStudents(studentsFromApi);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStatus({ type: 'error', message: error.message });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="rounded-xl border border-orange-100 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
      <h2 className="text-2xl font-black text-slate-950">Wyślij pliki uczniowi</h2>
      <p className="mt-2 max-w-2xl text-base font-medium text-slate-500">
        Wybierz ucznia z listy, dodaj plik i wpisz krótki opis materiału. Docelowo plik pojawi się u ucznia w zakładce notatek.
      </p>

      {status.message && (
        <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {status.message}
        </p>
      )}

      <form className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" onSubmit={(event) => event.preventDefault()}>
        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-base font-black text-slate-800">Uczeń</span>
            <select className="h-14 w-full rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-5 text-base font-bold text-slate-700 outline-none focus:border-orange-600 focus:bg-white">
              {databaseStudents.length === 0 && <option>Brak zarejestrowanych uczniów</option>}
              {databaseStudents.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
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
