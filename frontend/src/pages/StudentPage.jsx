import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../api.js';
import subjectPrimaryImage from '../../images/A1.png';
import subjectMaturaImage from '../../images/A2.png';
import subjectExtraImage from '../../images/A3.png';
import formatOnlineImage from '../../images/A4.png';
import formatOnsiteImage from '../../images/A5.png';

const contactPhoneDisplay = '+48 000 000 000';
const contactPhoneHref = '+48000000000';
const messengerChatUrl = 'https://www.facebook.com/profile.php?id=61591144089900&mibextid=wwXIfr&rdid=LMErxcEybUPiCe0v&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F191Mh71ZZi%2F%3Fmibextid%3DwwXIfr#';

const tabs = [
  { id: 'calendar', label: 'Kalendarz', icon: 'calendar' },
  { id: 'tutors', label: 'Korepetytorzy', icon: 'tutor' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'notes', label: 'Notatki i pliki', icon: 'file' },
];

const accountItems = [
  { id: 'profile', label: 'Profil', icon: 'profile' },
  { id: 'payments', label: 'Cennik i płatności', icon: 'payment' },
];

const pricingGroups = [
  {
    id: 'primary',
    label: 'Klasa 1-8 podstawówka',
    note: 'Budowanie solidnych podstaw, ułamki, proste równania.',
    plans: [
      {
        name: 'Pakiet podstawowy',
        price: 99,
        icon: 'sprout',
        features: [
          '1 lekcja tygodniowo',
          'Stały gwarantowany termin',
          'Budowanie solidnych podstaw',
          'Dla dzieci radzących sobie!',
        ],
      },
      {
        name: 'Pakiet rozwój',
        price: 89,
        icon: 'line',
        popular: true,
        features: [
          '2 lekcje tygodniowo',
          'Stały gwarantowany termin',
          'Skuteczny rozwój umiejętności',
          'Dla dzieci z drobnymi trudnościami!',
        ],
      },
      {
        name: 'Pakiet intensywny',
        price: 79,
        icon: 'target',
        features: [
          '3 lekcje tygodniowo',
          'Stały gwarantowany termin',
          'Maksymalne postępy',
          'Dla dzieci z dużymi zaległościami!',
        ],
      },
    ],
  },
  {
    id: 'secondary',
    label: 'Szkoła średnia / matura',
    note: 'Rozwijanie umiejętności, funkcje, problemy i arkusze maturalne.',
    plans: [
      {
        name: 'Pakiet podstawowy',
        price: 119,
        icon: 'sprout',
        features: [
          '1 lekcja tygodniowo',
          'Stały gwarantowany termin',
          'Budowanie solidnych podstaw',
          'Dla dzieci radzących sobie!',
        ],
      },
      {
        name: 'Pakiet rozwój',
        price: 109,
        icon: 'line',
        popular: true,
        features: [
          '2 lekcje tygodniowo',
          'Stały gwarantowany termin',
          'Skuteczny rozwój umiejętności',
          'Dla dzieci z drobnymi trudnościami!',
        ],
      },
      {
        name: 'Pakiet intensywny',
        price: 99,
        icon: 'target',
        features: [
          '3 lekcje tygodniowo',
          'Stały gwarantowany termin',
          'Maksymalne postępy',
          'Dla dzieci z dużymi zaległościami!',
        ],
      },
    ],
  },
  {
    id: 'extra',
    label: 'Lekcje dodatkowe',
    note: 'Pojedyncze zajęcia przed sprawdzianem, kartkówką lub trudnym tematem.',
    plans: [
      {
        name: 'Szkoła podstawowa',
        price: 119,
        icon: 'sprout',
        features: [
          'Przygotowanie do sprawdzianu',
          'Przygotowanie do kartkówki',
          'Pomoc z zadaniami domowymi',
          'Chęć zrozumienia lepiej tematu',
        ],
      },
      {
        name: 'Szkoła średnia',
        price: 140,
        icon: 'line',
        popular: true,
        features: [
          'Przygotowanie do sprawdzianu',
          'Przygotowanie do kartkówki',
          'Pomoc z zadaniami domowymi',
          'Chęć zrozumienia lepiej tematu',
        ],
      },
      {
        name: 'Klasa maturalna',
        price: 160,
        icon: 'target',
        features: [
          'Przygotowanie do sprawdzianu',
          'Przygotowanie do kartkówki',
          'Pomoc z zadaniami domowymi',
          'Chęć zrozumienia lepiej tematu',
        ],
      },
    ],
  },
];

const onboardingSubjects = [
  {
    id: 'primary',
    label: 'Klasa 1-8 podstawówka',
    description: 'Pomoc w nauce, przygotowanie do sprawdzianów, kartkówek i bieżące wsparcie.',
    image: subjectPrimaryImage,
  },
  {
    id: 'matura',
    label: 'Szkoła średnia / matura',
    description: 'Przygotowanie do matury podstawowej i rozszerzonej, nadrobienie zaległości, pomoc w zrozumieniu trudnych tematów.',
    image: subjectMaturaImage,
  },
  {
    id: 'other',
    label: 'Lekcje dodatkowe',
    description: 'Konkursy, olimpiady, studia, egzamin ósmoklasisty i inne indywidualne potrzeby.',
    image: subjectExtraImage,
  },
];

const tutoringFormats = [
  { id: 'online', label: 'Online', profileLabel: 'Zdalnie', description: 'Lekcje zdalne z materiałami w panelu.', image: formatOnlineImage },
  { id: 'krakow', label: 'Na miejscu', profileLabel: 'Na miejscu', description: 'Spotkania stacjonarne w Krakowie.', image: formatOnsiteImage },
];

const lessonPlaceOptions = [
  { id: 'online', label: 'Online', helper: 'Link do spotkania pojawi się w materiałach.', icon: 'video' },
  { id: 'onsite', label: 'Na miejscu', helper: 'Szczegóły adresu ustalisz z korepetytorem.', icon: 'location' },
];

const onboardingTutors = [
  {
    id: 'kuba',
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria Energetyki',
    year: 'III rok Politechniki',
    levels: '7-8 klasa, liceum, matura',
    specialization: 'Matura rozszerzona,\nfizyka, analiza',
    style: 'Logiczne myślenie i\npraktyka',
    quote: 'Tłumaczę trudne zagadnienia na proste przykłady i pokazuję, jak to działa w praktyce.',
    bullets: [
      'Łączy matematykę z fizyką i pokazuje zastosowania',
      'Pomaga przełamać bariery i zrozumieć "dlaczego"',
    ],
    tags: ['Matematyka SP i LO', 'Matura Rozszerzona', 'Analiza Matematyczna', 'Fizyka i Mechanika'],
    cta: 'Umów lekcję z Kubą',
  },
  {
    id: 'hubert',
    name: 'Hubert',
    initial: 'H',
    field: 'Budownictwo',
    year: 'II rok Politechniki',
    levels: '1-8 klasa, liceum, matura',
    specialization: 'Matura podstawowa,\ngeometria, statyka',
    style: 'Spokój, cierpliwość i krok\npo kroku',
    quote: 'Pomagam zrozumieć podstawy i uporządkować wiedzę, krok po kroku.',
    bullets: [
      'Tłumaczy cierpliwie, aż wszystko stanie się jasne',
      'Wspiera uczniów w budowaniu pewności siebie',
    ],
    tags: ['Matematyka podstawowa', 'Geometria i stereometria', 'Mechanika budowli', 'Wytrzymałość materiałów'],
    cta: 'Umów lekcję z Hubertem',
  },
];

const tutorProfiles = [
  {
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria Energetyki',
    year: 'III rok Politechniki',
    levels: '7-8 klasa, liceum, matura',
    specialization: 'Matura rozszerzona,\nfizyka, analiza',
    style: 'Logiczne myślenie i\npraktyka',
    quote: 'Tłumaczę trudne zagadnienia na proste przykłady i pokazuję, jak to działa w praktyce.',
    bullets: [
      'Łączy matematykę z fizyką i pokazuje zastosowania',
      'Pomaga przełamać bariery i zrozumieć "dlaczego"',
    ],
    tags: ['Matematyka SP i LO', 'Matura Rozszerzona', 'Analiza Matematyczna', 'Fizyka i Mechanika'],
    cta: 'Napisz do Kuby',
  },
  {
    name: 'Hubert',
    initial: 'H',
    field: 'Budownictwo',
    year: 'II rok Politechniki',
    levels: '1-8 klasa, liceum, matura',
    specialization: 'Matura podstawowa,\ngeometria, statyka',
    style: 'Spokój, cierpliwość i krok\npo kroku',
    quote: 'Pomagam zrozumieć podstawy i uporządkować wiedzę, krok po kroku.',
    bullets: [
      'Tłumaczy cierpliwie, aż wszystko stanie się jasne',
      'Wspiera uczniów w budowaniu pewności siebie',
    ],
    tags: ['Matematyka podstawowa', 'Geometria i stereometria', 'Mechanika budowli', 'Wytrzymałość materiałów', 'Egzamin Ósmoklasisty'],
    cta: 'Napisz do Huberta',
  },
];

const calendarPastDays = 14;
const calendarFutureDays = 28;
const chatRefreshMs = 5000;
const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
const dayLabels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];

function openContactModal(mode = 'email') {
  window.dispatchEvent(
    new CustomEvent('nastomatma:open-contact', {
      detail: { mode },
    }),
  );
}

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

function formatRemainingTime(targetIsoDate, now = new Date()) {
  if (!targetIsoDate) {
    return null;
  }

  const millisecondsLeft = new Date(targetIsoDate).getTime() - now.getTime();
  if (millisecondsLeft <= 0) {
    return null;
  }

  const totalMinutes = Math.ceil(millisecondsLeft / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} d ${hours} h`;
  }
  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
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

async function fetchStudentNotifications() {
  const response = await fetch(`${API_BASE_URL}/api/auth/notifications/`, {
    credentials: 'include',
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się pobrać powiadomień.');
  }

  return data.notifications;
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

async function deleteStudentAccount() {
  const response = await fetch(`${API_BASE_URL}/api/auth/account/`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się usunąć konta.');
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

function formatNotificationDate(isoDate) {
  if (!isoDate) {
    return '';
  }

  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

function formatFileSize(size) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getOnboardingStorageKey(userId) {
  return `nastomatma:onboarding:${userId}`;
}

function getOnboardingAnswersStorageKey(userId) {
  return `nastomatma:onboarding-answers:${userId}`;
}

function hasCompletedOnboarding(userId) {
  if (!userId || typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(getOnboardingStorageKey(userId)) === 'completed';
}

function getStoredOnboardingAnswers(userId) {
  if (!userId || typeof window === 'undefined') {
    return null;
  }

  try {
    const storedAnswers = window.localStorage.getItem(getOnboardingAnswersStorageKey(userId));
    return storedAnswers ? JSON.parse(storedAnswers) : null;
  } catch {
    return null;
  }
}

function isOnboardingComplete(answers) {
  return Boolean(answers?.subject && answers?.format && answers?.tutor);
}

function getInitialOnboardingAnswers(user) {
  if (isOnboardingComplete(user?.onboarding_answers)) {
    return user.onboarding_answers;
  }

  return getStoredOnboardingAnswers(user?.id) ?? user?.onboarding_answers ?? null;
}

async function saveOnboardingAnswers(answers) {
  const response = await fetch(`${API_BASE_URL}/api/auth/onboarding/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answers }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Nie udało się zapisać ankiety.');
  }

  return data.answers;
}

function getOnboardingSteps(includeNameStep) {
  return [
    ...(includeNameStep ? [{ id: 'name', label: 'Dane' }] : []),
    { id: 'subject', label: 'Zakres' },
    { id: 'format', label: 'Forma' },
    { id: 'tutor', label: 'Korepetytor' },
    { id: 'contact', label: 'Kontakt' },
  ];
}

export function StudentPage({ user, onLogout, onAccountDeleted, forceOnboarding = false }) {
  const shouldStartOnboarding = (
    user?.role === 'student'
    && !hasCompletedOnboarding(user?.id)
    && (forceOnboarding || user?.is_new_user)
  );
  const [activeTab, setActiveTab] = useState(shouldStartOnboarding ? 'profile' : 'calendar');
  const [showOnboarding, setShowOnboarding] = useState(shouldStartOnboarding);
  const [onboardingAnswers, setOnboardingAnswers] = useState(() => getInitialOnboardingAnswers(user));
  const [tokens, setTokens] = useState(user?.tokens ?? 0);
  const [contactModalMode, setContactModalMode] = useState(null);
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const [lessonNotifications, setLessonNotifications] = useState([]);
  const displayName = user?.full_name || user?.email || 'Uczeń';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';
  const firstName = displayName.split(' ')[0] || 'uczniu';
  const hasImportantOnboarding = !isOnboardingComplete(onboardingAnswers);

  useEffect(() => {
    setTokens(user?.tokens ?? 0);
  }, [user?.tokens]);

  useEffect(() => {
    setOnboardingAnswers(getInitialOnboardingAnswers(user));
  }, [user?.id, user?.onboarding_answers]);

  useEffect(() => {
    if (!isOnboardingComplete(onboardingAnswers) || isOnboardingComplete(user?.onboarding_answers)) {
      return;
    }

    saveOnboardingAnswers(onboardingAnswers).catch((error) => {
      console.error(error);
    });
  }, [onboardingAnswers, user?.onboarding_answers]);

  useEffect(() => {
    const shouldShow = (
      user?.role === 'student'
      && !hasCompletedOnboarding(user?.id)
      && (forceOnboarding || user?.is_new_user)
    );

    if (shouldShow) {
      setShowOnboarding(true);
      setActiveTab('profile');
    }
  }, [forceOnboarding, user?.id, user?.is_new_user, user?.role]);

  useEffect(() => {
    const handleOpenContact = (event) => {
      setContactModalMode(event.detail?.mode === 'messenger' ? 'messenger' : 'email');
    };

    window.addEventListener('nastomatma:open-contact', handleOpenContact);

    return () => {
      window.removeEventListener('nastomatma:open-contact', handleOpenContact);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUnreadChat = () => {
      fetchTeachers()
        .then((teachers) => {
          if (isMounted) {
            setHasUnreadChat(teachers.some((teacher) => teacher.has_unread));
          }
        })
        .catch(() => {});
    };

    loadUnreadChat();
    const intervalId = window.setInterval(loadUnreadChat, chatRefreshMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setLessonNotifications([]);
      return undefined;
    }

    let isMounted = true;

    const loadLessonNotifications = async () => {
      try {
        const notifications = await fetchStudentNotifications();

        if (isMounted) {
          setLessonNotifications(notifications);
        }
      } catch {
        if (isMounted) {
          setLessonNotifications([]);
        }
      }
    };

    loadLessonNotifications();
    const intervalId = window.setInterval(loadLessonNotifications, chatRefreshMs);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [user?.id]);

  const handleOnboardingComplete = async (answers) => {
    if (user?.id && typeof window !== 'undefined') {
      window.localStorage.setItem(getOnboardingStorageKey(user.id), 'completed');
      window.localStorage.setItem(getOnboardingAnswersStorageKey(user.id), JSON.stringify(answers));
    }

    setOnboardingAnswers(answers);
    try {
      const savedAnswers = await saveOnboardingAnswers(answers);
      setOnboardingAnswers(savedAnswers);
    } catch (error) {
      console.error(error);
    }
    setShowOnboarding(false);
    setActiveTab('payments');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    if (tabId === 'profile' && hasImportantOnboarding) {
      setShowOnboarding(true);
    }
  };

  return (
    <section className="min-h-screen bg-[#fbfaf7] text-slate-900 lg:grid lg:grid-cols-[18rem_1fr]">
      <StudentSidebar
        activeTab={activeTab}
        onChange={handleTabChange}
        onLogout={onLogout}
        hasImportantOnboarding={hasImportantOnboarding}
        hasUnreadChat={hasUnreadChat}
      />

      <main className="min-w-0 lg:col-start-2">
        <StudentHeader
          displayName={displayName}
          initial={initial}
          tokens={tokens}
          notifications={lessonNotifications}
          activeTab={activeTab}
          onChange={handleTabChange}
          onLogout={onLogout}
          hasImportantOnboarding={hasImportantOnboarding}
          hasUnreadChat={hasUnreadChat}
        />

        <div className="px-4 py-8 sm:px-6 lg:px-10">
          <div>
            <h1 className="text-4xl font-black leading-tight text-[#07463f] sm:text-5xl">
              Cześć, {firstName}
            </h1>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-500">
              Zarezerwuj lekcję, pisz do korepetytora i odbieraj materiały z zajęć.
            </p>
          </div>

          <div className="mt-7">
            {activeTab === 'calendar' && (
              <CalendarPanel
                user={user}
                tokens={tokens}
                onTokensChange={setTokens}
                onboardingAnswers={onboardingAnswers}
              />
            )}
            {activeTab === 'tutors' && <TutorsPanel onOpenChat={() => setActiveTab('chat')} />}
            {activeTab === 'chat' && <ChatPanel onboardingAnswers={onboardingAnswers} />}
            {activeTab === 'notes' && <NotesPanel />}
            {activeTab === 'profile' && (
              <ProfilePanel
                user={user}
                showOnboarding={showOnboarding}
                forceNameStep={forceOnboarding}
                onOnboardingComplete={handleOnboardingComplete}
                onAccountDeleted={onAccountDeleted}
                onboardingAnswers={onboardingAnswers}
              />
            )}
            {activeTab === 'payments' && (
              <PricingPanel
                user={user}
                onboardingAnswers={onboardingAnswers}
              />
            )}
          </div>
        </div>
      </main>

      {contactModalMode && (
        <StudentContactModal
          mode={contactModalMode}
          onClose={() => setContactModalMode(null)}
        />
      )}
    </section>
  );
}

function StudentSidebar({ activeTab, onChange, onLogout, hasImportantOnboarding, hasUnreadChat }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <aside className="hidden border-b border-zinc-200 bg-white px-4 py-5 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center justify-between gap-4 lg:block">
        <a
          href="/"
          aria-label="NaSTOmatMa"
          className="shrink-0 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-slate-900">Na</span>
          <span className="text-[#007566]">STO</span>
          <span className="text-slate-900">mat</span>
          <span className="text-[#007566]">Ma</span>
        </a>

        <div className="hidden rounded-xl bg-[#f6f2eb] px-4 py-4 text-sm font-bold text-[#07463f] lg:mt-12 lg:block">
          <p>Masz pytania?</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            Napisz do korepetytora lub sprawdź materiały.
          </p>
        </div>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-6 lg:mt-10">
        <SidebarGroup title="Nauka">
          {tabs.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              isUnread={item.id === 'chat' && hasUnreadChat}
              onClick={() => onChange(item.id)}
            />
          ))}
        </SidebarGroup>

        <div className="lg:mt-auto">
          <SidebarGroup title="Konto">
            {accountItems.map((item) => (
              <SidebarButton
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                isImportant={item.id === 'profile' && hasImportantOnboarding}
                onClick={() => onChange(item.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black text-slate-600 transition hover:bg-[#f6f2eb] hover:text-[#07463f]"
            >
              <TabIcon type="logout" className="h-5 w-5 shrink-0" />
              Wyloguj się
            </button>
          </SidebarGroup>
        </div>
      </nav>

      {isLogoutModalOpen && (
        <LogoutConfirmModal
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={onLogout}
        />
      )}
    </aside>
  );
}

function SidebarGroup({ title, children }) {
  return (
    <div>
      <p className="mb-3 px-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function SidebarButton({ item, isActive, isImportant = false, isUnread = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-black transition ${
        isImportant
          ? 'border-orange-200 bg-orange-100 text-orange-800 shadow-[0_10px_24px_rgba(234,88,12,0.12)] ring-1 ring-orange-200 hover:bg-orange-200'
        : isUnread
          ? 'border-red-700 bg-red-50 text-red-800 shadow-[0_10px_24px_rgba(153,27,27,0.12)] ring-2 ring-red-200 hover:bg-red-100'
        : isActive
          ? 'border-transparent bg-[#f6f2eb] text-[#07463f] shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
          : 'border-transparent text-slate-600 hover:bg-[#f6f2eb] hover:text-[#07463f]'
      }`}
    >
      <TabIcon type={item.icon} className="h-5 w-5 shrink-0" />
      <span className="min-w-0 flex-1">{item.label}</span>
      {isImportant && (
        <span className="rounded-full bg-orange-600 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-white">
          Ważne
        </span>
      )}
      {isUnread && (
        <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.14)]" />
      )}
    </button>
  );
}

function StudentHeader({
  displayName,
  initial,
  tokens,
  notifications = [],
  activeTab,
  onChange,
  onLogout,
  hasImportantOnboarding,
  hasUnreadChat,
}) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const notificationCount = notifications.length;
  const handleMobileTabChange = (tabId) => {
    onChange(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-[#fbfaf7] px-4 py-2 text-sm font-black text-slate-600">
          <TabIcon type="tokens" className="h-4 w-4 text-[#07463f]" />
          Żetony: {tokens}
        </div>

        <div className="flex min-w-0 items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${
                notificationCount > 0
                  ? 'border-orange-200 bg-orange-50 text-orange-700 shadow-[0_8px_18px_rgba(234,88,12,0.12)]'
                  : 'border-zinc-200 text-slate-500 hover:border-orange-200 hover:text-orange-700'
              }`}
              aria-label="Powiadomienia"
            >
              <TabIcon type="bell" className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(21rem,calc(100vw-2rem))] rounded-xl border border-orange-100 bg-white p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-black text-slate-950">Powiadomienia</h2>
                  {notificationCount > 0 && (
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700">
                      {notificationCount}
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3">
                  {notificationCount === 0 && (
                    <p className="rounded-lg bg-[#fcfaf7] px-4 py-4 text-sm font-bold text-slate-500">
                      Brak nowych powiadomień o korepetycjach.
                    </p>
                  )}

                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-lg border px-4 py-4 ${
                        notification.type === 'rejected'
                          ? 'border-red-100 bg-red-50'
                          : notification.type === 'tokens'
                            ? 'border-orange-100 bg-orange-50'
                          : 'border-emerald-100 bg-emerald-50'
                      }`}
                    >
                      <p className={`text-sm font-black ${
                        notification.type === 'rejected'
                          ? 'text-red-800'
                          : notification.type === 'tokens'
                            ? 'text-orange-800'
                            : 'text-emerald-800'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-black uppercase tracking-wide text-slate-400">
                        {(notification.teacher_name || notification.teacherName) && (
                          <span>{notification.teacher_name || notification.teacherName}</span>
                        )}
                        {notification.created_at && (
                          <span>{formatNotificationDate(notification.created_at)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white">
            {initial}
          </span>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-[#07463f] transition hover:border-[#007566] hover:bg-[#f3faf7] lg:hidden"
            aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">{isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}</span>
            <span className="grid gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
          <div className="hidden min-w-0 sm:block">
            <p className="max-w-[14rem] truncate text-sm font-black text-slate-950">{displayName}</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">Uczeń</p>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 pb-5 pt-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] lg:hidden">
          <nav className="grid gap-5">
            <SidebarGroup title="Nauka">
              {tabs.map((item) => (
                <SidebarButton
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  isUnread={item.id === 'chat' && hasUnreadChat}
                  onClick={() => handleMobileTabChange(item.id)}
                />
              ))}
            </SidebarGroup>

            <SidebarGroup title="Konto">
              {accountItems.map((item) => (
                <SidebarButton
                  key={item.id}
                  item={item}
                  isActive={activeTab === item.id}
                  isImportant={item.id === 'profile' && hasImportantOnboarding}
                  onClick={() => handleMobileTabChange(item.id)}
                />
              ))}
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black text-slate-600 transition hover:bg-[#f6f2eb] hover:text-[#07463f]"
              >
                <TabIcon type="logout" className="h-5 w-5 shrink-0" />
                Wyloguj się
              </button>
            </SidebarGroup>
          </nav>
        </div>
      )}

      {isLogoutModalOpen && (
        <LogoutConfirmModal
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={onLogout}
        />
      )}
    </header>
  );
}

function CalendarPanel({ user, tokens, onTokensChange, onboardingAnswers }) {
  const lessonDetailsRef = useRef(null);
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [slots, setSlots] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMobileDayIso, setSelectedMobileDayIso] = useState(null);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [cancelingSlotId, setCancelingSlotId] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [selectedLessonPlace, setSelectedLessonPlace] = useState(lessonPlaceOptions[0].id);
  const [lessonScopeMessage, setLessonScopeMessage] = useState('');
  const [isLessonScopeRequired, setIsLessonScopeRequired] = useState(false);
  const [upcomingLessonSlot, setUpcomingLessonSlot] = useState(null);
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(false);
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
  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId) ?? null;
  const preferredTutor = onboardingTutors.find((tutor) => tutor.id === onboardingAnswers?.tutor) ?? null;
  const preferredTeacher = preferredTutor
    ? teachers.find((teacher) => teacher.name.toLowerCase() === preferredTutor.name.toLowerCase()) ?? null
    : null;
  const displayedTeachers = preferredTeacher
    ? [preferredTeacher, ...teachers.filter((teacher) => teacher.id !== preferredTeacher.id)]
    : teachers;

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
    if (selectedSlotId && !slots.some((slot) => slot.id === selectedSlotId)) {
      setSelectedSlotId(null);
    }
  }, [selectedSlotId, slots]);

  useEffect(() => {
    let isMounted = true;

    fetchTeachers()
      .then((teachersFromApi) => {
        if (!isMounted) {
          return;
        }

        setTeachers(teachersFromApi);
        setSelectedTeacherId((currentId) => {
          const preferredTeacherFromApi = preferredTutor
            ? teachersFromApi.find((teacher) => teacher.name.toLowerCase() === preferredTutor.name.toLowerCase())
            : null;

          if (preferredTeacherFromApi) {
            return preferredTeacherFromApi.id;
          }

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
  }, [preferredTutor?.name]);

  useEffect(() => {
    loadUpcomingLesson();
  }, [teachers, user?.id]);

  const moveWeek = (direction) => {
    setWeekStart((currentWeekStart) => addDays(currentWeekStart, direction * 7));
    setSelectedMobileDayIso(null);
    setSelectedSlotId(null);
  };

  const loadUpcomingLesson = async (teachersForLookup = teachers) => {
    if (!user?.id || teachersForLookup.length === 0) {
      setUpcomingLessonSlot(null);
      setIsUpcomingLoading(false);
      return;
    }

    setIsUpcomingLoading(true);
    try {
      const lookupWeekStarts = Array.from({ length: 5 }, (_, index) => (
        addDays(getWeekStart(), index * 7)
      ));
      const calendars = await Promise.all(
        teachersForLookup.flatMap((teacher) => (
          lookupWeekStarts.map((lookupWeekStart) => fetchCalendarSlots(lookupWeekStart, teacher.id))
        )),
      );
      const nextSlot = calendars
        .flatMap((calendarData) => calendarData.slots)
        .filter((slot) => (
          (slot.status === 'booked' || slot.status === 'pending')
          && slot.student?.id === user.id
          && !isPastSlot(slot)
        ))
        .sort((firstSlot, secondSlot) => (
          new Date(`${firstSlot.date}T${firstSlot.start_time}:00`)
          - new Date(`${secondSlot.date}T${secondSlot.start_time}:00`)
        ))[0] ?? null;

      setUpcomingLessonSlot(nextSlot);
    } catch {
      setUpcomingLessonSlot(null);
    } finally {
      setIsUpcomingLoading(false);
    }
  };

  const bookSlot = async (slot, scopeMessage) => {
    setBookingSlotId(slot.id);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/calendar/book/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slot_id: slot.id }),
      });
      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się zarezerwować terminu.');
      }

      if (typeof data.tokens === 'number') {
        onTokensChange(data.tokens);
      }
      const trimmedScopeMessage = scopeMessage.trim();
      let scopeMessageSent = true;
      if (trimmedScopeMessage && slot.teacher?.id) {
        try {
          await sendStudentChatMessage(
            slot.teacher.id,
            `Zakres korepetycji (${formatSlotDate(slot.date)}, ${slot.start_time} - ${slot.end_time}): ${trimmedScopeMessage}`,
          );
        } catch {
          scopeMessageSent = false;
        }
      }
      setStatus({
        type: 'success',
        message: scopeMessageSent
          ? 'Termin oczekuje na akceptację przez korepetytora.'
          : 'Termin oczekuje na akceptację. Wiadomości o zakresie nie udało się wysłać do czatu.',
      });
      const calendarData = await fetchCalendarSlots(weekStart, selectedTeacherId);
      setSlots(calendarData.slots);
      if (typeof calendarData.tokens === 'number') {
        onTokensChange(calendarData.tokens);
      }
      await loadUpcomingLesson();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setBookingSlotId(null);
    }
  };

  const cancelLessonSlot = async (slot) => {
    const isBooked = slot?.status === 'booked';
    const slotId = slot?.id;
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
      setStatus({
        type: 'success',
        message: isBooked
          ? 'Zajęcia zostały anulowane. Żeton wrócił na konto.'
          : 'Rezerwacja została anulowana. Żeton wrócił na konto.',
      });
      const calendarData = await fetchCalendarSlots(weekStart, selectedTeacherId);
      setSlots(calendarData.slots);
      if (typeof calendarData.tokens === 'number') {
        onTokensChange(calendarData.tokens);
      }
      await loadUpcomingLesson();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setCancelingSlotId(null);
    }
  };

  const selectAvailableSlot = (slot) => {
    setSelectedSlotId(slot.id);
    setStatus({ type: null, message: '' });
    scrollToLessonDetailsOnMobile();
  };

  const selectLessonSlot = (slot) => {
    setSelectedSlotId(slot.id);
    setStatus({ type: null, message: '' });
    scrollToLessonDetailsOnMobile();
  };

  const scrollToLessonDetailsOnMobile = () => {
    if (!window.matchMedia('(max-width: 1023px)').matches) {
      return;
    }

    window.setTimeout(() => {
      lessonDetailsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  };

  const openBookingConfirm = (slot = selectedSlot) => {
    if (!slot) {
      setStatus({ type: 'error', message: 'Najpierw wybierz wolny termin w kalendarzu.' });
      return;
    }

    if (!hasTokens) {
      setStatus({ type: 'error', message: 'Brak żetonów. Nie można rezerwować lekcji.' });
      setIsNoTokensModalOpen(true);
      return;
    }

    if (!lessonScopeMessage.trim()) {
      setIsLessonScopeRequired(true);
      setStatus({ type: 'error', message: 'Uzupełnij zakres korepetycji przed rezerwacją.' });
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
    setSelectedSlotId(null);
    setSlotToConfirm(null);
    setIsLessonScopeRequired(false);
  };

  const confirmBooking = async () => {
    if (!slotToConfirm) {
      return;
    }

    await bookSlot(slotToConfirm, lessonScopeMessage);
    setSlotToConfirm(null);
  };

  const confirmCancel = async () => {
    if (!slotToCancel) {
      return;
    }

    await cancelLessonSlot(slotToCancel);
    setSlotToCancel(null);
  };

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="rounded-xl border border-zinc-200 bg-white px-4 py-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:px-6">
        <div className="grid gap-5 xl:flex xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#07463f]">Kalendarz terminów</h2>
            <p className="mt-2 text-base font-medium text-slate-500">
              Wybierz wolny termin i zarezerwuj lekcję.
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => setWeekStart(getWeekStart())}
              className="order-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-[#b7d5c8] hover:text-[#07463f] sm:order-none sm:w-auto"
            >
              Dzisiaj
            </button>
            <div className="order-1 grid grid-cols-[3rem_1fr_3rem] items-center gap-3 sm:order-none sm:flex sm:gap-3">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() => moveWeek(-1)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-[#b7d5c8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹
              </button>
              <p className="text-center text-sm font-black text-slate-700 sm:min-w-[14rem]">
                {formatWeekRange(weekStart)}
              </p>
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => moveWeek(1)}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:border-[#b7d5c8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <p className="text-sm font-bold text-slate-500 sm:mr-1">
            Wybierz korepetytora:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:contents">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                type="button"
                onClick={() => chooseTeacher(teacher.id)}
                className={`relative flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                  teacher.id === selectedTeacherId
                    ? 'border-[#0a604f] bg-[#eef5ee] shadow-[0_10px_24px_rgba(7,70,63,0.1)]'
                    : 'border-zinc-200 bg-white hover:border-[#b7d5c8]'
                }`}
              >
                {teacher.id === selectedTeacherId && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007566] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                    Wybrany
                  </span>
                )}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a604f] text-sm font-black text-white">
                  {teacher.initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black text-slate-950">{teacher.name}</span>
                </span>
              </button>
            ))}
          </div>

          {teachers.length === 0 && (
            <p className="rounded-lg bg-white px-4 py-4 text-sm font-bold text-slate-500">
              Brak dostępnych korepetytorów.
            </p>
          )}
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
                    className={`rounded-xl border border-zinc-200 px-4 py-3 text-left text-slate-950 shadow-[0_10px_24px_rgba(39,40,45,0.05)] transition hover:border-orange-300 hover:bg-orange-50/40 ${isPastDay ? 'bg-zinc-100' : 'bg-white'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black ${isPastDay ? 'bg-white text-slate-400' : 'bg-[#eef5ee] text-[#07463f]'}`}>
                          {day.date}
                        </span>
                        <div>
                          <p className={`text-base font-black ${isPastDay ? 'text-slate-400' : 'text-slate-950'}`}>
                            {day.label}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-slate-400">Kliknij, aby zobaczyć godziny</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-black">
                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                          {availableCount} wolne
                        </span>
                        {ownPendingCount > 0 && (
                          <span className="rounded-full bg-orange-500 px-2.5 py-1 text-white">
                            {ownPendingCount} oczekuje
                          </span>
                        )}
                        {ownBookedCount > 0 && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
                            {ownBookedCount} zaakcept.
                          </span>
                        )}
                      </div>
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
                  const isCompletedForStudent = isPast && (isPendingForStudent || isBookedForStudent);

                  return (
                    <div
                      key={`${selectedMobileDay.isoDate}-${startTime}`}
                      className={`rounded-xl border px-4 py-4 ${
                        isCompletedForStudent
                          ? 'border-slate-200 bg-slate-100 text-slate-600'
                          : isAvailable
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
                              : isCompletedForStudent
                                ? 'Zrealizowana'
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

                      {isCompletedForStudent && (
                        <button
                          type="button"
                          onClick={() => selectLessonSlot(slot)}
                          className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          {selectedSlotId === slot.id ? 'Wybrano termin' : 'Pokaż szczegóły'}
                        </button>
                      )}
                      {!isCompletedForStudent && isAvailable && (
                        <button
                          type="button"
                          disabled={bookingSlotId === slot?.id || isLoading}
                          onClick={() => selectAvailableSlot(slot)}
                          className={`mt-4 w-full rounded-md px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            selectedSlotId === slot.id
                              ? 'bg-[#0a604f] text-white hover:bg-[#07463f]'
                              : 'bg-orange-600 text-white hover:bg-orange-700'
                          }`}
                        >
                          {selectedSlotId === slot.id ? 'Wybrano termin' : 'Wybierz termin'}
                        </button>
                      )}
                      {!isCompletedForStudent && isPendingForStudent && (
                        <button
                          type="button"
                          disabled={cancelingSlotId === slot?.id || isLoading}
                          onClick={() => selectLessonSlot(slot)}
                          className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-black text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {selectedSlotId === slot.id ? 'Wybrano termin' : 'Pokaż szczegóły'}
                        </button>
                      )}
                      {!isCompletedForStudent && isBookedForStudent && (
                        <button
                          type="button"
                          onClick={() => selectLessonSlot(slot)}
                          className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-black text-emerald-800 transition hover:bg-emerald-50"
                        >
                          {selectedSlotId === slot.id ? 'Wybrano termin' : 'Pokaż spotkanie'}
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
            <div className="grid grid-cols-[72px_repeat(7,1fr)] bg-[#fbfaf7]">
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
                  const isCompletedForStudent = isPast && (isPendingForStudent || isBookedForStudent);

                  return (
                    <button
                      key={`${day.isoDate}-${startTime}`}
                      type="button"
                      disabled={(!isAvailable && !isPendingForStudent && !isBookedForStudent) || bookingSlotId === slot?.id || cancelingSlotId === slot?.id || isLoading}
                      title={
                        isCompletedForStudent
                          ? 'Lekcja zrealizowana'
                          : isPendingForStudent
                          ? 'Oczekiwanie na akceptację przez korepetytora'
                          : isBookedForStudent
                            ? 'Rezerwacja zaakceptowana'
                            : undefined
                      }
                      onClick={() => {
                        if (isAvailable) {
                          selectAvailableSlot(slot);
                        } else if (isPendingForStudent) {
                          selectLessonSlot(slot);
                        } else if (isBookedForStudent) {
                          selectLessonSlot(slot);
                        }
                      }}
                      className={`min-h-[56px] border-r border-zinc-200 px-2 py-2 text-center text-xs font-black transition last:border-r-0 ${
                        isCompletedForStudent
                          ? selectedSlotId === slot.id
                            ? 'bg-slate-600 text-white ring-2 ring-inset ring-slate-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : isAvailable
                          ? selectedSlotId === slot.id
                            ? 'bg-[#0a604f] text-white ring-2 ring-inset ring-[#07463f]'
                            : 'bg-[#e8f1ea] text-[#0a604f] hover:bg-[#dcebe2]'
                        : isPendingForStudent
                          ? selectedSlotId === slot.id
                            ? 'bg-orange-600 text-white ring-2 ring-inset ring-orange-800'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                          : isBookedForStudent
                            ? selectedSlotId === slot.id
                              ? 'bg-emerald-700 text-white ring-2 ring-inset ring-emerald-900'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
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

      <div ref={lessonDetailsRef}>
        {selectedSlot ? (
          <LessonDetailsPanel
            slot={selectedSlot}
            teacher={selectedTeacher}
            selectedPlace={selectedLessonPlace}
            onPlaceChange={setSelectedLessonPlace}
            onReserve={() => openBookingConfirm(selectedSlot)}
            onCancelReservation={() => openCancelConfirm(selectedSlot)}
            scopeMessage={lessonScopeMessage}
            onScopeMessageChange={(value) => {
              setLessonScopeMessage(value);
              if (value.trim()) {
                setIsLessonScopeRequired(false);
              }
            }}
            isScopeRequired={isLessonScopeRequired}
            isBooking={bookingSlotId === selectedSlot.id}
            isCanceling={cancelingSlotId === selectedSlot.id}
            canReserve={selectedSlot.status === 'available' && !isPastSlot(selectedSlot)}
            canCancel={(
              selectedSlot.status === 'pending'
              || (selectedSlot.status === 'booked' && selectedSlot.can_cancel)
            ) && selectedSlot.student?.id === user?.id && !isPastSlot(selectedSlot)}
          />
        ) : (
          <UpcomingLessonsPanel
            slot={upcomingLessonSlot}
            teacher={selectedTeacher}
            isLoading={isLoading || isUpcomingLoading}
          />
        )}
      </div>

      {slotToConfirm && (
        <ConfirmBookingModal
          slot={slotToConfirm}
          selectedPlace={selectedLessonPlace}
          scopeMessage={lessonScopeMessage}
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

function ConfirmBookingModal({ slot, selectedPlace, scopeMessage, onCancel, onConfirm }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const place = lessonPlaceOptions.find((option) => option.id === selectedPlace) ?? lessonPlaceOptions[0];
  const trimmedScopeMessage = scopeMessage.trim();

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
          Czy na pewno chcesz zarezerwować korepetycje na {formatSlotDate(slot.date)}, godz. {slot.start_time} - {slot.end_time}, {place.label.toLowerCase()}?
        </p>
        {trimmedScopeMessage && (
          <div className="mt-3 rounded-md border border-zinc-200 bg-[#fbfaf7] px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
              Zakres korepetycji
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {trimmedScopeMessage}
            </p>
          </div>
        )}
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
  const isBooked = slot.status === 'booked';

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
        <h3 className="text-2xl font-black text-slate-950">
          {isBooked ? 'Anulować zajęcia?' : 'Anulować rezerwację?'}
        </h3>
        <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
          {isBooked ? 'Anulujesz potwierdzone zajęcia' : 'Anulujesz oczekującą rezerwację'} na {formatSlotDate(slot.date)}, godz. {slot.start_time}.
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
            {isSubmitting ? 'Anuluję...' : isBooked ? 'Anuluj zajęcia' : 'Anuluj'}
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

function UpcomingLessonsPanel({ slot, teacher, isLoading }) {
  const displayTeacher = slot?.teacher ?? teacher;
  const isBooked = slot?.status === 'booked';
  const isPending = slot?.status === 'pending';

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(15,23,42,0.05)] 2xl:sticky 2xl:top-24 2xl:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Plan lekcji
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            Najbliższe korepetycje
          </h3>
        </div>
        <span className="rounded-full bg-[#eef5ee] px-3 py-1.5 text-xs font-black text-[#0a604f]">
          Info
        </span>
      </div>

      {isLoading ? (
        <div className="mt-7 rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 py-5 text-sm font-bold text-slate-500">
          Ładuję najbliższy termin...
        </div>
      ) : slot ? (
        <div className="mt-7 space-y-6">
          <DetailBlock title="Data i czas">
            {formatSlotDate(slot.date)}, {slot.start_time} - {slot.end_time}
          </DetailBlock>

          <DetailBlock title="Korepetytor">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a604f] text-sm font-black text-white">
                {displayTeacher?.initial || displayTeacher?.name?.charAt(0) || 'K'}
              </span>
              <span>
                <span className="block font-black text-slate-950">{displayTeacher?.name || 'Korepetytor'}</span>
                <span className="mt-0.5 block text-sm font-semibold text-slate-400">Nauczyciel matematyki</span>
              </span>
            </div>
          </DetailBlock>

          <DetailBlock title="Status">
            {isBooked
              ? 'Spotkanie zostało potwierdzone przez korepetytora.'
              : isPending
                ? 'Rezerwacja oczekuje na potwierdzenie przez korepetytora.'
                : 'Termin jest zapisany w kalendarzu.'}
          </DetailBlock>

          <div className="rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 py-3 text-sm font-bold leading-6 text-slate-500">
            Kliknij zarezerwowaną godzinę w kalendarzu, aby zobaczyć pełne szczegóły lub anulować rezerwację oczekującą.
          </div>
        </div>
      ) : (
        <div className="mt-7 space-y-5">
          <div className="rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 py-5 text-sm font-bold leading-6 text-slate-500">
            Nie masz jeszcze nadchodzących korepetycji.
          </div>
          <p className="text-sm font-semibold leading-6 text-slate-500">
            Kliknij wolną godzinę w kalendarzu, aby wybrać termin i przejść do rezerwacji.
          </p>
        </div>
      )}
    </aside>
  );
}

function LessonDetailsPanel({
  slot,
  teacher,
  selectedPlace,
  onPlaceChange,
  onReserve,
  onCancelReservation,
  scopeMessage,
  onScopeMessageChange,
  isScopeRequired = false,
  isBooking,
  isCanceling,
  canReserve,
  canCancel,
}) {
  const displayTeacher = slot?.teacher ?? teacher;
  const isBooked = slot?.status === 'booked';
  const isPending = slot?.status === 'pending';
  const isAvailable = slot?.status === 'available';
  const place = lessonPlaceOptions.find((option) => option.id === selectedPlace) ?? lessonPlaceOptions[0];
  const isReserved = isBooked || isPending;
  const isCompleted = Boolean(slot && isReserved && isPastSlot(slot));
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const cancellationTimeLeft = isBooked && !isCompleted
    ? formatRemainingTime(slot?.cancel_deadline, currentTime)
    : null;
  const canCancelNow = Boolean(canCancel && (!isBooked || cancellationTimeLeft));

  useEffect(() => {
    if (!isBooked || isCompleted || !slot?.cancel_deadline) {
      return undefined;
    }

    setCurrentTime(new Date());
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [isBooked, isCompleted, slot?.cancel_deadline]);

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(15,23,42,0.05)] 2xl:sticky 2xl:top-24 2xl:self-start">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Szczegóły lekcji
          </p>
          <h3 className="mt-2 text-2xl font-black text-slate-950">
            {isCompleted ? 'Zrealizowana lekcja' : isReserved ? 'Twoje spotkanie' : slot ? 'Wybrany termin' : 'Wybierz termin'}
          </h3>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-black ${
          isCompleted
            ? 'bg-slate-100 text-slate-700'
            : isBooked
            ? 'bg-emerald-100 text-emerald-700'
            : isPending
              ? 'bg-orange-100 text-orange-700'
              : 'bg-[#eef5ee] text-[#0a604f]'
        }`}>
          {isCompleted ? 'Zrealizowana' : isBooked ? 'Zaplanowane' : isPending ? 'Oczekuje' : isAvailable ? 'Wolne' : 'Info'}
        </span>
      </div>

      <div className="mt-7 space-y-6">
        <DetailBlock title="Rodzaj lekcji">
          Matematyka indywidualna
        </DetailBlock>

        <DetailBlock title="Data i czas">
          {slot
            ? `${formatSlotDate(slot.date)}, ${slot.start_time} - ${slot.end_time}`
            : 'Kliknij termin w kalendarzu, aby zobaczyć szczegóły.'}
        </DetailBlock>

        <DetailBlock title="Korepetytor">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0a604f] text-sm font-black text-white">
              {displayTeacher?.initial || displayTeacher?.name?.charAt(0) || 'K'}
            </span>
            <span>
              <span className="block font-black text-slate-950">{displayTeacher?.name || 'Korepetytor'}</span>
              <span className="mt-0.5 block text-sm font-semibold text-slate-400">Nauczyciel matematyki</span>
            </span>
          </div>
        </DetailBlock>

        <DetailBlock title="Miejsce">
          {isReserved ? (
            <div className="flex items-center gap-3 text-[#0a604f]">
              <TabIcon type={place.icon} className="h-5 w-5" />
              <span className="font-black">{place.label}</span>
            </div>
          ) : (
            <div className="grid gap-2">
              {lessonPlaceOptions.map((option) => {
                const isSelected = option.id === selectedPlace;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onPlaceChange(option.id)}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                      isSelected
                        ? 'border-[#0a604f] bg-[#eef5ee] text-[#0a604f]'
                        : 'border-zinc-200 bg-white text-slate-600 hover:border-[#b7d5c8] hover:bg-[#fbfaf7]'
                    }`}
                  >
                    <TabIcon type={option.icon} className="h-5 w-5 shrink-0" />
                    <span className="font-black">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-1 text-sm font-semibold text-slate-400">
            {place.helper}
          </p>
        </DetailBlock>

        {isReserved && (
          <DetailBlock title="Status">
            <div>
              <p>
                {isCompleted
                  ? 'Lekcja została zrealizowana.'
                  : isPending
                  ? 'Rezerwacja oczekuje na potwierdzenie przez korepetytora.'
                  : slot?.cancel_message || 'Spotkanie zostało potwierdzone przez korepetytora.'}
              </p>
              {cancellationTimeLeft && (
                <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-orange-800">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-orange-600">
                    Bezpłatne anulowanie
                  </p>
                  <p className="mt-1 text-lg font-black">
                    Zostało {cancellationTimeLeft}
                  </p>
                </div>
              )}
            </div>
          </DetailBlock>
        )}

        <DetailBlock title="Zakres korepetycji">
          <textarea
            value={scopeMessage}
            onChange={(event) => onScopeMessageChange(event.target.value)}
            disabled={!slot || isReserved}
            rows={4}
            maxLength={600}
            placeholder="Napisz, z czego mają być korepetycje, np. funkcja liniowa, równania, przygotowanie do sprawdzianu."
            className={`w-full resize-none rounded-lg border bg-[#fbfaf7] px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-slate-400 ${
              isScopeRequired
                ? 'lesson-scope-required border-red-700 focus:border-red-700 focus:ring-4 focus:ring-red-700/15'
                : 'border-zinc-200 focus:border-[#0a604f] focus:ring-4 focus:ring-[#0a604f]/10'
            }`}
          />
          <p className={`mt-1 text-xs font-semibold ${isScopeRequired ? 'text-red-700' : 'text-slate-400'}`}>
            {isScopeRequired
              ? 'Uzupełnij zakres korepetycji przed rezerwacją.'
              : 'Wiadomość zostanie wysłana do korepetytora po rezerwacji terminu.'}
          </p>
        </DetailBlock>

        <DetailBlock title="Materiały i notatki">
          <div className="rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 py-3 text-sm font-bold text-slate-500">
            Pliki od korepetytora znajdziesz w zakładce Notatki i pliki.
          </div>
        </DetailBlock>
      </div>

      {isCompleted ? (
        <div className="mt-7 rounded-md bg-slate-100 px-5 py-3 text-center text-sm font-black text-slate-700">
          Zrealizowana
        </div>
      ) : canCancelNow ? (
        <button
          type="button"
          disabled={isCanceling}
          onClick={onCancelReservation}
          className="mt-7 w-full rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-70"
        >
          {isCanceling ? 'Anuluję...' : isBooked ? 'Anuluj zajęcia' : 'Anuluj rezerwację'}
        </button>
      ) : canReserve ? (
        <button
          type="button"
          disabled={isBooking}
          onClick={onReserve}
          className="mt-7 w-full rounded-md bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          {isBooking ? 'Rezerwuję...' : 'Zarezerwuj'}
        </button>
      ) : isBooked ? (
        <div className="mt-7 rounded-md bg-emerald-100 px-5 py-3 text-center text-sm font-black text-emerald-800">
          Potwierdzona lekcja
        </div>
      ) : isPending ? (
        <div className="mt-7 rounded-md bg-orange-100 px-5 py-3 text-center text-sm font-black text-orange-700">
          Oczekuje na potwierdzenie
        </div>
      ) : (
        <div className="mt-7 rounded-md bg-slate-100 px-5 py-3 text-center text-sm font-black text-slate-600">
          Brak dostępnej akcji
        </div>
      )}
    </aside>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">{title}</p>
      <div className="text-base font-semibold leading-6 text-slate-700">{children}</div>
    </div>
  );
}

function TutorsPanel({ onOpenChat }) {
  const [expandedMobileTutors, setExpandedMobileTutors] = useState({});

  const toggleMobileTutor = (tutorName) => {
    setExpandedMobileTutors((current) => ({
      ...current,
      [tutorName]: !current[tutorName],
    }));
  };

  return (
    <section className="bg-[#fffdf9]">
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#8fc1b2]">
          Nasi korepetytorzy
        </p>
        <h2 className="relative mx-auto mt-2 inline-block text-3xl font-black leading-tight text-[#07463f] sm:text-4xl">
          Poznaj osoby, które Ci pomogą
          <span className="absolute -bottom-2 right-7 h-2 w-28 rounded-full bg-[#cde4d8]" />
        </h2>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {tutorProfiles.map((tutor) => (
          <StudentTutorProfileCard
            key={tutor.name}
            tutor={tutor}
            isMobileExpanded={Boolean(expandedMobileTutors[tutor.name])}
            onToggleMobile={() => toggleMobileTutor(tutor.name)}
            onOpenChat={onOpenChat}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <TutorContactCard
          title="Email"
          value="support.nastomatma@gmail.com"
          onClick={() => openContactModal('email')}
        />
        <TutorContactCard
          title="Messenger / WhatsApp"
          value="Szybki i bezpośredni kontakt"
          onClick={() => openContactModal('messenger')}
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

function TutorContactCard({ title, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-orange-100 bg-[#fcfaf7] px-5 py-5 text-left transition hover:border-orange-300 hover:bg-orange-50"
    >
      <span className="block text-base font-black text-slate-950">{title}</span>
      <span className="mt-2 block text-sm font-semibold leading-6 text-slate-500">{value}</span>
    </button>
  );
}

function StudentContactModal({ mode, onClose }) {
  const isMessengerMode = mode === 'messenger';
  const contactEmail = 'support.nastomatma@gmail.com';
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setStatus({ type: 'error', message: 'Wpisz wiadomość przed wysłaniem.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/contact/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Nie udało się wysłać wiadomości.');
      }

      setMessage('');
      setStatus({ type: 'success', message: 'Wiadomość została wysłana.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-contact-modal-title"
      onMouseDown={onClose}
    >
      <div
        className="relative my-auto w-full max-w-xl rounded-lg border border-zinc-200 bg-white px-6 py-7 shadow-[0_28px_90px_rgba(15,23,42,0.28)] sm:px-10 sm:py-9"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition hover:bg-[#eff8f5] hover:text-[#007566]"
          aria-label="Zamknij panel kontaktowy"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#e8f1ea] text-[#007566]">
            <TabIcon type="chat" className="h-7 w-7" />
          </div>
          <div>
            <p className="text-2xl font-black leading-none tracking-normal">
              <span className="text-slate-950">Na</span>
              <span className="text-[#007566]">STO</span>
              <span className="text-slate-950">mat</span>
              <span className="text-[#007566]">Ma</span>
            </p>
            <p className="mt-1 text-xs font-bold text-slate-400">Napisz do nas</p>
          </div>
        </div>

        <div className="mt-7 text-center">
          <h2 id="student-contact-modal-title" className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
            Skontaktuj się
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {isMessengerMode
              ? 'Napisz do nas bezpośrednio na Messengerze albo skorzystaj z numeru telefonu.'
              : 'Opisz krótko, z czym możemy pomóc.'}
          </p>
        </div>

        {isMessengerMode ? (
          <div className="mt-6 space-y-4">
            <a
              href={`tel:${contactPhoneHref}`}
              className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-extrabold text-[#07463f] transition hover:border-[#b7d5c8] hover:bg-[#eff8f5]"
            >
              <span className="flex items-center gap-3">
                <TabIcon type="chat" className="h-5 w-5 shrink-0 text-[#007566]" />
                Numer telefonu
              </span>
              <span>{contactPhoneDisplay}</span>
            </a>

            <a
              href={messengerChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#007566] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.2)] transition hover:bg-[#005d51]"
            >
              Przejdź do czatu Messenger
              <span aria-hidden="true">→</span>
            </a>

            <p className="rounded-md bg-[#eff8f5] px-4 py-3 text-sm font-bold leading-6 text-[#07463f]">
              Messenger otworzy się w nowej karcie.
            </p>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-400">
                Wiadomość zostanie wysłana na
              </label>
              <div className="flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-extrabold text-[#07463f]">
                <TabIcon type="file" className="h-5 w-5 shrink-0 text-[#007566]" />
                <span>{contactEmail}</span>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-400">
                Treść wiadomości
              </span>
              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status.message) {
                    setStatus({ type: null, message: '' });
                  }
                }}
                rows={7}
                placeholder="Napisz, dla kogo są lekcje, jaki poziom i czego potrzebujecie."
                className="w-full resize-none rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#007566] focus:ring-4 focus:ring-[#007566]/10"
              />
            </label>

            {status.message && (
              <p
                className={`rounded-md px-4 py-3 text-sm font-bold ${
                  status.type === 'error'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-[#eff8f5] text-[#07463f]'
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#007566] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.2)] transition hover:bg-[#005d51] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
              <span aria-hidden="true">→</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function StudentTutorProfileCard({ tutor, isMobileExpanded, onToggleMobile, onOpenChat }) {
  const details = [
    {
      icon: <TabIcon type="profile" className="h-5 w-5" />,
      label: 'Poziomy',
      value: tutor.levels,
    },
    {
      icon: <TabIcon type="file" className="h-5 w-5" />,
      label: 'Specjalizacja',
      value: tutor.specialization,
    },
    {
      icon: <TabIcon type="tokens" className="h-5 w-5" />,
      label: 'Styl',
      value: tutor.style,
    },
  ];
  const mobileDetailsId = `student-tutor-details-${tutor.name.toLowerCase()}`;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_14px_28px_rgba(15,23,42,0.08)] sm:px-8 sm:py-9 lg:px-10">
      <div className="flex items-start gap-5">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#eee9df] bg-[#f5f1ea] text-3xl font-black text-[#07463f] shadow-inner sm:h-24 sm:w-24 sm:text-4xl">
          {tutor.initial}
        </span>
        <div>
          <h3 className="text-4xl font-black leading-none text-slate-950 sm:text-5xl">{tutor.name}</h3>
          <p className="mt-2 text-base font-extrabold leading-tight text-[#0a604f] sm:text-lg">
            {tutor.field}
          </p>
          <p className="mt-1 text-base font-bold leading-tight text-slate-400 sm:text-lg">
            {tutor.year}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleMobile}
        className="mt-6 flex w-full items-center justify-between rounded-lg border border-[#cde4d8] bg-[#f3faf7] px-4 py-3 text-left text-sm font-black text-[#07463f] transition hover:bg-[#e8f4ef] sm:hidden"
        aria-expanded={isMobileExpanded}
        aria-controls={mobileDetailsId}
      >
        <span>{isMobileExpanded ? 'Zwiń informacje o korepetytorze' : 'Rozwiń informacje o korepetytorze'}</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition-transform ${isMobileExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />
        </svg>
      </button>

      <div
        id={mobileDetailsId}
        className={`overflow-hidden transition-all duration-700 ease-out ${
          isMobileExpanded
            ? 'mt-7 max-h-[980px] opacity-100'
            : 'mt-0 max-h-0 opacity-0'
        } sm:mt-9 sm:max-h-none sm:overflow-visible sm:opacity-100`}
      >
        <div className="grid gap-5 text-center sm:grid-cols-3 sm:gap-6">
          {details.map((detail) => (
            <div key={detail.label}>
              <span className="mx-auto flex h-7 w-7 items-center justify-center text-[#527b68]">
                {detail.icon}
              </span>
              <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-300">
                {detail.label}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm font-black leading-5 text-slate-950 sm:text-base sm:leading-6">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-7">
          <blockquote className="border-l-4 border-[#c6d7ce] pl-5 text-lg font-medium italic leading-8 text-slate-500">
            „{tutor.quote}”
          </blockquote>

          <ul className="mt-7 space-y-3">
            {tutor.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-base font-medium leading-7 text-slate-600">
                <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#0a604f]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
            {tutor.tags.map((tag) => (
              <span key={tag} className="text-base font-extrabold text-[#0a604f]">
                {tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenChat}
            className="mt-10 inline-flex items-center gap-3 text-lg font-black text-[#0a604f] transition hover:text-[#007566]"
          >
            {tutor.cta}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function getPricingGroupIdFromSubject(subjectId) {
  if (subjectId === 'matura') {
    return 'secondary';
  }
  if (subjectId === 'other') {
    return 'extra';
  }
  return 'primary';
}

function PricingPanel({ user, onboardingAnswers }) {
  const defaultPricingGroupId = getPricingGroupIdFromSubject(onboardingAnswers?.subject);
  const [selectedPricingGroupId, setSelectedPricingGroupId] = useState(defaultPricingGroupId);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const selectedPricingGroup = pricingGroups.find((group) => group.id === selectedPricingGroupId) ?? pricingGroups[0];

  useEffect(() => {
    setSelectedPricingGroupId(defaultPricingGroupId);
  }, [defaultPricingGroupId]);

  return (
    <section className="relative overflow-hidden rounded-xl border border-zinc-200 bg-[#fbfaf7] px-5 py-8 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:px-8">
      <div className="absolute left-[8%] top-10 hidden grid-cols-4 gap-5 opacity-60 xl:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
        ))}
      </div>
      <div className="absolute -right-14 -top-16 hidden h-48 w-72 rotate-[-18deg] rounded-[48%] bg-[#fff0cf] xl:block" />

      <div className="relative">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8fc1b2]">
            Cennik Pakiety
          </p>
          <h2 className="relative mx-auto mt-2 inline-block text-4xl font-black leading-tight text-[#07463f] sm:text-5xl">
            Elastyczne Pakiety Lekcyjne
            <span className="absolute -bottom-1 left-2 h-2 w-[94%] rounded-full bg-[#f6c65f]" />
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-7 text-slate-700">
            Im więcej lekcji w tygodniu, tym niższa stawka za każdą godzinę.
            Bez długoterminowych umów - płacisz miesięcznie i rezygnujesz kiedy chcesz.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <InfoSmallIcon className="h-5 w-5" />
            Wszystkie ceny podane są w przeliczeniu na 60-minutowe zajęcia indywidualne.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-2 rounded-xl bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:grid-cols-3">
          {pricingGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => setSelectedPricingGroupId(group.id)}
              className={`rounded-lg px-4 py-3 text-sm font-black transition ${
                selectedPricingGroupId === group.id
                  ? 'bg-[#007566] text-white shadow-[0_10px_22px_rgba(0,117,102,0.18)]'
                  : 'text-[#07463f] hover:bg-[#e8f1ea]'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm font-semibold leading-6 text-slate-500">
          {selectedPricingGroup.note}
        </p>

        <div className="mt-9 grid gap-6 lg:grid-cols-3">
          {selectedPricingGroup.plans.map((item) => (
            <StudentPricingCard
              key={item.name}
              item={item}
              onChoose={() => setSelectedPackage({ group: selectedPricingGroup, plan: item })}
            />
          ))}
        </div>
      </div>

      {selectedPackage && (
        <PackageContactModal
          user={user}
          onboardingAnswers={onboardingAnswers}
          group={selectedPackage.group}
          plan={selectedPackage.plan}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </section>
  );
}

function StudentPricingCard({ item, onChoose }) {
  const isPopular = item.popular;

  return (
    <article
      className={`relative flex h-full flex-col rounded-xl border px-6 py-8 shadow-[0_16px_34px_rgba(15,23,42,0.06)] ${
        isPopular
          ? 'border-[#f6c65f] bg-[#fffaf0]'
          : 'border-zinc-100 bg-white'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#f6c65f] px-6 py-2 text-xs font-black uppercase tracking-wide text-[#07463f]">
          <StarSmallIcon className="h-4 w-4" />
          Najpopularniejszy
        </div>
      )}

      <div className="flex items-start gap-5">
        <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${isPopular ? 'bg-[#fff0cf] text-[#d39312]' : 'bg-[#e8f1ea] text-[#007566]'}`}>
          <PricingSmallIcon type={item.icon} />
        </span>
        <div>
          <p className={`text-xs font-black uppercase tracking-[0.24em] ${isPopular ? 'text-[#9c6a17]' : 'text-[#0a604f]'}`}>
            {item.name}
          </p>
          <p className="mt-3 text-4xl font-black leading-none text-[#07463f]">
            {item.price} <span className="text-2xl">zł/h</span>
          </p>
        </div>
      </div>

      <span className="mt-5 block h-1 w-14 rounded-full bg-[#f6c65f]" />

      <ul className="mt-7 flex-1 space-y-4">
        {item.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-base font-medium leading-6 text-slate-700">
            <CheckSmallIcon className={`mt-0.5 h-5 w-5 shrink-0 ${isPopular ? 'text-[#f0b544]' : 'text-[#007566]'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onChoose}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#164f36,#0b5f4f)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(9,64,47,0.18)] transition hover:brightness-110"
      >
        Wybieram pakiet
      </button>
    </article>
  );
}

function PackageContactModal({ user, onboardingAnswers, group, plan, onClose }) {
  const studentName = user?.full_name || user?.email || 'Uczeń';
  const selectedTutor = onboardingTutors.find((item) => item.id === onboardingAnswers?.tutor);
  const selectedFormat = tutoringFormats.find((item) => item.id === onboardingAnswers?.format);
  const studentPhone = onboardingAnswers?.phone?.trim();
  const bodyLines = [
    'Dzień dobry,',
    '',
    `Uczeń ${studentName} chciałby zakupić żetony na lekcje: ${group.label}.`,
    `Wybrany pakiet: ${plan.name}, ${plan.price} zł/h.`,
    selectedTutor ? `Wybrany korepetytor: ${selectedTutor.name}.` : null,
    selectedFormat ? `Forma zajęć: ${selectedFormat.profileLabel}.` : null,
    studentPhone ? `Numer kontaktowy ucznia: ${studentPhone}.` : 'Numer kontaktowy ucznia: jeszcze nie dodany.',
    '',
    'Proszę o informację, jak możemy dokończyć płatność.',
    '',
    'Pozdrawiam',
  ].filter(Boolean);
  const [messageBody, setMessageBody] = useState(() => bodyLines.join('\n'));
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const smsHref = `sms:${contactPhoneHref}?body=${encodeURIComponent(messageBody)}`;
  const phoneHref = `tel:${contactPhoneHref}`;

  const sendPackageMessage = async () => {
    setIsSending(true);
    setSendError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/package-contact/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageBody,
          teacher_name: selectedTutor?.name,
          package_name: plan.name,
          pricing_group: group.label,
        }),
      });
      const data = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? 'Nie udało się wysłać wiadomości.');
      }

      setIsMessageSent(true);
    } catch (error) {
      setSendError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white px-6 py-6 shadow-[0_28px_80px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#007566]">
              Zakup pakietu
            </p>
            <h3 className="mt-2 text-2xl font-black text-slate-950">
              Skontaktuj się z nami
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Przygotowaliśmy wiadomość o pakiecie {plan.name} dla zakresu {group.label}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-3 py-1 text-lg font-black text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-xl border border-zinc-200 bg-[#fbfaf7] px-5 py-5">
            <span className="block text-base font-black text-slate-950">Numer telefonu</span>
            <span className="mt-2 block text-2xl font-black text-[#07463f]">{contactPhoneDisplay}</span>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={smsHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#007566] px-4 py-3 text-sm font-black text-white transition hover:bg-[#005d51]"
              >
                Wyślij SMS
              </a>
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center rounded-lg border border-[#007566] px-4 py-3 text-sm font-black text-[#07463f] transition hover:bg-[#eef5ee]"
              >
                Zadzwoń
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-zinc-200 bg-white px-4 py-4">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Wyślij wiadomość
            </span>
            <textarea
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              rows={9}
              className="mt-3 w-full resize-none rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[#007566] focus:bg-white focus:ring-4 focus:ring-[#007566]/10"
            />
          </label>
          <button
            type="button"
            onClick={sendPackageMessage}
            disabled={isSending || !messageBody.trim()}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[#007566] px-5 py-3 text-sm font-black text-white transition hover:bg-[#005d51] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? 'Wysyłam...' : 'Wyślij'}
          </button>
          {sendError && (
            <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm font-black text-red-700">
              {sendError}
            </p>
          )}
          {isMessageSent && (
            <p className="mt-3 rounded-lg bg-[#eef5ee] px-4 py-3 text-sm font-black text-[#07463f]">
              Korepetytor skontaktuje się mailowo lub telefonicznie.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PricingSmallIcon({ type }) {
  if (type === 'line') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 17 9 11l4 4 8-8m0 0h-5m5 0v5" />
      </svg>
    );
  }

  if (type === 'target') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-6v2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 21V10m0 0C9 6 5 6 3 7c0 5 4 7 9 3Zm0 0c3-4 7-4 9-3 0 5-4 7-9 3Z" />
    </svg>
  );
}

function CheckSmallIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function StarSmallIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="m12 2.8 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6-4.3-4.2 6-.9L12 2.8Z" />
    </svg>
  );
}

function InfoSmallIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function ProfilePanel({ user, showOnboarding = false, forceNameStep = false, onOnboardingComplete, onAccountDeleted, onboardingAnswers }) {
  const displayName = user?.full_name || user?.email || 'Uczeń';
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const selectedSubject = onboardingSubjects.find((item) => item.id === onboardingAnswers?.subject);
  const selectedFormat = tutoringFormats.find((item) => item.id === onboardingAnswers?.format);
  const selectedTutor = onboardingTutors.find((item) => item.id === onboardingAnswers?.tutor);
  const contactPhone = onboardingAnswers?.phone?.trim() || 'Jeszcze nie dodany';

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError('');

    try {
      await deleteStudentAccount();
      if (user?.id && typeof window !== 'undefined') {
        window.localStorage.removeItem(getOnboardingStorageKey(user.id));
        window.localStorage.removeItem(getOnboardingAnswersStorageKey(user.id));
      }
      onAccountDeleted?.();
    } catch (error) {
      setDeleteError(error.message);
      setIsDeleting(false);
    }
  };

  const handleOnboardingComplete = (answers) => {
    setIsEditingPreferences(false);
    onOnboardingComplete?.(answers);
  };

  if (showOnboarding || isEditingPreferences) {
    return (
      <OnboardingSurvey
        user={user}
        forceNameStep={forceNameStep}
        initialAnswers={onboardingAnswers}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:px-8">
      <h2 className="text-2xl font-black text-[#07463f]">Profil</h2>
      <p className="mt-2 text-base font-medium text-slate-500">
        Podstawowe informacje o koncie ucznia.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ProfileField label="Imię i nazwisko" value={displayName} />
        <ProfileField label="Adres e-mail" value={user?.email || 'Brak adresu'} />
        <ProfileField label="Rola" value="Uczeń" />
        <ProfileField label="Dostępne żetony" value={String(user?.tokens ?? 0)} />
      </div>

      <div className="mt-10 border-t border-zinc-200 pt-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-black text-[#07463f]">Preferencje z ankiety</h3>
          <button
            type="button"
            onClick={() => setIsEditingPreferences(true)}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#007566] px-5 text-sm font-black text-[#07463f] transition hover:bg-[#eef5ee]"
          >
            Edytuj
          </button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <ProfileField label="Zakres nauczania" value={selectedSubject?.label || 'Jeszcze nie wybrany'} />
          <ProfileField label="Sposób nauczania" value={selectedFormat?.profileLabel || 'Jeszcze nie wybrany'} />
          <ProfileField label="Wybrany korepetytor" value={selectedTutor?.name || 'Jeszcze nie wybrany'} />
          <ProfileField label="Numer kontaktowy" value={contactPhone} />
        </div>
      </div>

      <div className="mt-10 border-t border-zinc-200 pt-7">
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-5">
          <h3 className="text-lg font-black text-red-800">Usuń konto</h3>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-red-700">
            Ta akcja trwale usuwa konto użytkownika oraz dane powiązane z panelem. Zarezerwowane terminy zostaną zwolnione.
          </p>
          <button
            type="button"
            onClick={() => {
              setDeleteError('');
              setIsDeleteModalOpen(true);
            }}
            className="mt-5 rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
          >
            Usuń konto
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteAccountModal
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={() => {
            if (!isDeleting) {
              setIsDeleteModalOpen(false);
              setDeleteError('');
            }
          }}
          onConfirm={handleDeleteAccount}
        />
      )}
    </section>
  );
}

function DeleteAccountModal({ error, isDeleting, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-[0_28px_80px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
            <WarningIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 id="delete-account-title" className="text-xl font-black text-slate-950">
              Czy na pewno chcesz usunąć konto?
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Tej operacji nie będzie można cofnąć. Po potwierdzeniu wylogujemy Cię i usuniemy dane konta.
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? 'Usuwanie...' : 'Tak, usuń konto'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoutConfirmModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white px-6 py-6 shadow-[0_28px_80px_rgba(15,23,42,0.35)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
            <WarningIcon className="h-6 w-6" />
          </span>
          <div>
            <h3 id="logout-title" className="text-xl font-black text-slate-950">
              Czy na pewno chcesz się wylogować?
            </h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Po potwierdzeniu wrócisz do strony głównej i trzeba będzie zalogować się ponownie.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-400"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700"
          >
            Tak, wyloguj się
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingSurvey({ user, forceNameStep, initialAnswers, onComplete }) {
  const hasKnownName = Boolean(user?.full_name && !user.full_name.includes('@'));
  const includeNameStep = forceNameStep || !hasKnownName;
  const [step, setStep] = useState(includeNameStep ? 'name' : 'subject');
  const [form, setForm] = useState({
    fullName: initialAnswers?.fullName || (hasKnownName ? user.full_name : ''),
    subject: initialAnswers?.subject || '',
    format: initialAnswers?.format || '',
    tutor: initialAnswers?.tutor || '',
    phone: initialAnswers?.phone || '',
  });
  const steps = getOnboardingSteps(includeNameStep);
  const currentStepIndex = steps.findIndex((item) => item.id === step);
  const previousStep = steps[currentStepIndex - 1] ?? null;
  const nextStep = steps[currentStepIndex + 1] ?? null;
  const canGoBack = Boolean(previousStep);
  const canGoNext = (
    (step === 'name' && Boolean(form.fullName.trim()))
    || (step === 'subject' && Boolean(form.subject))
    || (step === 'format' && Boolean(form.format))
    || (step === 'tutor' && Boolean(form.tutor))
    || step === 'contact'
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const choose = (field, value, nextStep) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setStep(nextStep);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    if (form.fullName.trim()) {
      setStep('subject');
    }
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    onComplete?.(form);
  };

  const goBack = () => {
    if (previousStep) {
      setStep(previousStep.id);
    }
  };

  const goNext = () => {
    if (!canGoNext) {
      return;
    }

    if (!nextStep) {
      onComplete?.(form);
      return;
    }

    if (nextStep) {
      setStep(nextStep.id);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white px-5 py-6 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#007566]">
            Ankieta startowa
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#07463f]">
            Dopasujmy korepetycje
          </h2>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-slate-500">
            Kilka wyborów wystarczy, żeby pokazać właściwy cennik i przejść do rezerwacji terminu.
          </p>
        </div>

        <OnboardingSteps currentStep={step} includeNameStep={includeNameStep} />
      </div>

      {step === 'name' && (
        <form className="mt-8 max-w-xl" onSubmit={handleNameSubmit}>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Imię i nazwisko</span>
            <input
              type="text"
              value={form.fullName}
              onChange={updateField('fullName')}
              className="mt-3 h-14 w-full rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 text-base font-bold text-slate-950 outline-none transition focus:border-[#007566] focus:bg-white"
              placeholder="np. Michał Młynarczyk"
              autoComplete="name"
              required
            />
          </label>
        </form>
      )}

      {step === 'subject' && (
        <SubjectChoiceCards
          selected={form.subject}
          onChoose={(value) => choose('subject', value, 'format')}
        />
      )}

      {step === 'format' && (
        <ChoiceGrid
          title="Jaka forma korepetycji?"
          options={tutoringFormats}
          selected={form.format}
          onChoose={(value) => choose('format', value, 'tutor')}
        />
      )}

      {step === 'tutor' && (
        <TutorChoiceGrid
          title="Wybierz korepetytora"
          options={onboardingTutors}
          selected={form.tutor}
          onChoose={(value) => choose('tutor', value, 'contact')}
        />
      )}

      {step === 'contact' && (
        <form className="mt-8 max-w-xl" onSubmit={handleContactSubmit}>
          <label className="block">
            <span className="text-sm font-black text-slate-700">Numer telefonu opcjonalnie</span>
            <input
              type="tel"
              value={form.phone}
              onChange={updateField('phone')}
              className="mt-3 h-14 w-full rounded-lg border border-zinc-200 bg-[#fbfaf7] px-4 text-base font-bold text-slate-950 outline-none transition focus:border-[#007566] focus:bg-white"
              placeholder="np. 500 000 000"
              autoComplete="tel"
            />
          </label>
        </form>
      )}

      <OnboardingNavigation
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        nextLabel={step === 'contact' ? 'Przejdź do cennika i płatności' : 'Dalej'}
        onBack={goBack}
        onNext={goNext}
      />
    </section>
  );
}

function OnboardingSteps({ currentStep, includeNameStep }) {
  const steps = getOnboardingSteps(includeNameStep);
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex min-w-[15rem] items-center justify-end">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shadow-[0_8px_18px_rgba(15,23,42,0.08)] ${
              index <= currentIndex ? 'bg-[#007566] text-white' : 'bg-zinc-100 text-slate-400'
            }`}
            title={step.label}
          >
            {index + 1}
          </span>
          {index < steps.length - 1 && (
            <span className="h-px w-10 bg-zinc-200 sm:w-14" />
          )}
        </div>
      ))}
    </div>
  );
}

function OnboardingNavigation({ canGoBack, canGoNext, nextLabel, onBack, onNext }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 px-5 text-sm font-black text-slate-700 transition hover:border-[#007566] hover:text-[#07463f] disabled:cursor-not-allowed disabled:border-zinc-100 disabled:text-slate-300"
      >
        Wstecz
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="inline-flex h-12 items-center justify-center rounded-lg bg-[#007566] px-6 text-sm font-black text-white transition hover:bg-[#005d51] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function SubjectChoiceCards({ selected, onChoose }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-black text-slate-950">Jaki zakres Cię interesuje?</h3>
      <div className="mt-5 grid gap-6 xl:grid-cols-3">
        {onboardingSubjects.map((option) => (
          <article
            key={option.id}
            className={`rounded-xl border bg-white p-3 transition ${
              selected === option.id
                ? 'border-[#007566] shadow-[0_16px_34px_rgba(7,70,63,0.12)]'
                : 'border-zinc-200 hover:border-[#8ab9ad] hover:shadow-[0_14px_30px_rgba(15,23,42,0.06)]'
            }`}
          >
            <img
              src={option.image}
              alt=""
              className="h-48 w-full rounded-lg object-cover sm:h-56 xl:h-52 2xl:h-56"
            />
            <div className="px-2 pb-2 pt-5">
              <h4 className="text-xl font-black text-[#07463f]">{option.label}</h4>
              <p className="mt-3 min-h-[4.5rem] text-sm font-semibold leading-6 text-slate-600">
                {option.description}
              </p>
              <button
                type="button"
                onClick={() => onChoose(option.id)}
                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-3 rounded-lg border text-sm font-black transition ${
                  selected === option.id
                    ? 'border-[#007566] bg-[#007566] text-white'
                    : 'border-[#007566] bg-white text-[#07463f] hover:bg-[#eef5ee]'
                }`}
              >
                Wybierz
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
        <span aria-hidden="true">▣</span>
        Twoje odpowiedzi są prywatne i pomogą nam lepiej dopasować ofertę do Ciebie.
      </p>
    </div>
  );
}

function ChoiceGrid({ title, options, selected, onChoose }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChoose(option.id)}
            className={`overflow-hidden rounded-xl border text-left transition ${
              selected === option.id
                ? 'border-[#007566] bg-[#eef5ee] text-[#07463f]'
                : 'border-zinc-200 bg-[#fbfaf7] text-slate-700 hover:border-[#b7d5c8]'
            }`}
          >
            {option.image && (
              <img
                src={option.image}
                alt=""
                className="h-44 w-full object-cover sm:h-52 lg:h-48"
              />
            )}
            <span className="block px-5 py-5">
              <span className="flex items-center gap-3">
                {option.initial && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007566] text-base font-black text-white">
                    {option.initial}
                  </span>
                )}
                <span className="text-lg font-black">{option.label}</span>
              </span>
              <span className="mt-3 block text-sm font-semibold leading-6 text-slate-500">
                {option.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TutorChoiceGrid({ title, options, selected, onChoose }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-black text-slate-950">{title}</h3>
      <div className="mt-5 grid gap-6 xl:grid-cols-2">
        {options.map((tutor) => {
          const isSelected = selected === tutor.id;

          return (
            <button
              key={tutor.id}
              type="button"
              onClick={() => onChoose(tutor.id)}
              className={`rounded-xl border bg-white px-5 py-6 text-left transition sm:px-7 ${
                isSelected
                  ? 'border-[#007566] bg-[#eef5ee] text-[#07463f] shadow-[0_16px_34px_rgba(7,70,63,0.12)]'
                  : 'border-zinc-200 text-slate-700 hover:border-[#b7d5c8] hover:shadow-[0_14px_30px_rgba(15,23,42,0.06)]'
              }`}
            >
              <span className="flex items-start gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-[#eee9df] bg-[#f5f1ea] text-2xl font-black text-[#07463f] shadow-inner">
                  {tutor.initial}
                </span>
                <span>
                  <span className="block text-3xl font-black leading-none text-slate-950">{tutor.name}</span>
                  <span className="mt-2 block text-base font-extrabold leading-tight text-[#0a604f]">
                    {tutor.field}
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-tight text-slate-400">
                    {tutor.year}
                  </span>
                </span>
              </span>

              <span className="mt-7 grid gap-4 text-center sm:grid-cols-3">
                {[
                  ['Poziomy', tutor.levels],
                  ['Specjalizacja', tutor.specialization],
                  ['Styl', tutor.style],
                ].map(([label, value]) => (
                  <span key={label}>
                    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-300">
                      {label}
                    </span>
                    <span className="mt-2 block whitespace-pre-line text-sm font-black leading-5 text-slate-950">
                      {value}
                    </span>
                  </span>
                ))}
              </span>

              <span className="mt-7 block border-t border-zinc-200 pt-6">
                <span className="block border-l-4 border-[#c6d7ce] pl-4 text-base font-medium italic leading-7 text-slate-500">
                  „{tutor.quote}”
                </span>
                <span className="mt-5 grid gap-3">
                  {tutor.bullets.map((bullet) => (
                    <span key={bullet} className="flex gap-3 text-sm font-semibold leading-6 text-slate-600">
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#0a604f]" />
                      <span>{bullet}</span>
                    </span>
                  ))}
                </span>
                <span className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                  {tutor.tags.map((tag) => (
                    <span key={tag} className="text-sm font-extrabold text-[#0a604f]">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="mt-7 inline-flex items-center gap-3 text-base font-black text-[#0a604f]">
                  {tutor.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-[#fbfaf7] px-5 py-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

function WarningIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M12 9v4m0 4h.01M10.3 4.4 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0Z"
      />
    </svg>
  );
}

function ChatPanel({ onboardingAnswers }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const selectedTeacher = teachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;
  const preferredTutor = onboardingTutors.find((tutor) => tutor.id === onboardingAnswers?.tutor) ?? null;
  const preferredTeacher = preferredTutor
    ? teachers.find((teacher) => teacher.name.toLowerCase() === preferredTutor.name.toLowerCase()) ?? null
    : null;
  const displayedTeachers = preferredTeacher
    ? [preferredTeacher, ...teachers.filter((teacher) => teacher.id !== preferredTeacher.id)]
    : teachers;

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

          const preferredTeacherFromApi = preferredTutor
            ? teachersFromApi.find((teacher) => teacher.name.toLowerCase() === preferredTutor.name.toLowerCase())
            : null;

          return preferredTeacherFromApi?.id ?? teachersFromApi[0]?.id ?? null;
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
  }, [preferredTutor]);

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
    <section className="grid min-w-0 gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="min-w-0 rounded-xl border border-orange-100 bg-white px-4 py-6 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-6 sm:py-7">
        <h2 className="text-2xl font-black text-slate-950">Korepetytorzy</h2>
        <div className="mt-6 space-y-3">
          {teachers.length === 0 && (
            <p className="rounded-lg bg-[#fcfaf7] px-4 py-4 text-sm font-bold text-slate-500">
              Brak korepetytorów w bazie.
            </p>
          )}

          {displayedTeachers.map((teacher) => {
            const isSelected = teacher.id === selectedTeacherId;
            const isPreferred = preferredTeacher?.id === teacher.id;
            const hasUnread = Boolean(teacher.has_unread);

            return (
              <button
                key={teacher.id}
                type="button"
                onClick={() => setSelectedTeacherId(teacher.id)}
                className={`relative flex w-full min-w-0 items-center gap-3 rounded-lg border text-left transition sm:gap-4 ${
                  hasUnread
                    ? 'border-red-700 bg-red-50 px-4 py-4 shadow-[0_14px_30px_rgba(153,27,27,0.12)] ring-2 ring-red-200 hover:bg-red-100 sm:px-5 sm:py-5'
                  : isPreferred
                    ? 'border-[#007566] bg-[#eef5ee] px-4 py-4 shadow-[0_14px_30px_rgba(0,117,102,0.12)] ring-2 ring-[#b7d5c8] sm:px-5 sm:py-5'
                    : isSelected
                      ? 'border-orange-200 bg-orange-50 px-4 py-4'
                      : 'border-transparent bg-[#fcfaf7] px-4 py-4 hover:bg-orange-50'
                }`}
              >
                {isPreferred && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#007566] shadow-sm">
                    Wybrany
                  </span>
                )}
                <span className={`flex shrink-0 items-center justify-center rounded-full font-black text-white ${
                  isPreferred
                    ? 'h-12 w-12 bg-[#007566] text-lg shadow-[0_12px_24px_rgba(0,117,102,0.22)] sm:h-16 sm:w-16 sm:text-2xl'
                    : 'h-12 w-12 bg-orange-600 text-lg'
                }`}>
                  {teacher.initial}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-black ${isPreferred ? 'text-lg text-[#07463f] sm:text-xl' : 'text-base text-slate-950'}`}>
                    {teacher.name}
                  </span>
                  {hasUnread && (
                    <span className="mt-1 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-red-700">
                      Nowa wiadomość
                    </span>
                  )}
                  <span className={`block truncate font-semibold ${isPreferred ? 'mt-2 text-sm text-[#527b68]' : 'text-sm text-slate-500'}`}>
                    {teacher.last_message}
                  </span>
                </span>
                {hasUnread && (
                  <span className="h-3 w-3 shrink-0 rounded-full bg-red-600 shadow-[0_0_0_4px_rgba(220,38,38,0.14)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 rounded-xl border border-orange-100 bg-white px-4 py-6 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-6 sm:py-7">
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
              <div className={`max-w-full rounded-xl px-4 py-3 sm:max-w-xl sm:px-5 sm:py-4 ${message.own ? 'bg-orange-600 text-white' : 'bg-[#fcfaf7] text-slate-700'}`}>
                <p className="text-sm font-black">{message.author} · {message.time}</p>
                <p className="mt-2 text-base font-medium leading-7">{message.body}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] gap-3" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Napisz wiadomość..."
            disabled={!selectedTeacher}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            className="h-14 min-w-0 rounded-md border-2 border-zinc-200 bg-[#fcfaf7] px-4 text-base font-medium outline-none focus:border-orange-600 focus:bg-white sm:px-5"
          />
          <button type="submit" disabled={!selectedTeacher} className="rounded-md bg-orange-600 px-4 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-6">
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

  if (type === 'profile') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
      </svg>
    );
  }

  if (type === 'payment') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 7h18v12H3V7Zm0 4h18M7 15h4" />
      </svg>
    );
  }

  if (type === 'logout') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 17l5-5-5-5m5 5H3m7 9h8a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-8" />
      </svg>
    );
  }

  if (type === 'tokens') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 3 3 8l9 5 9-5-9-5Zm-7 8 7 4 7-4M5 15l7 4 7-4" />
      </svg>
    );
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-4 12a2 2 0 0 1-4 0" />
      </svg>
    );
  }

  if (type === 'video') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4V7Zm13 4 4-3v8l-4-3" />
      </svg>
    );
  }

  if (type === 'location') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h5m-5 4h6" />
    </svg>
  );
}
