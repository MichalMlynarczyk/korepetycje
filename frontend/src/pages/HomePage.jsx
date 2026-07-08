import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api.js';
import individualLearningImage from '../assets/individual-learning.png';
import heroStudentImage from '../../images/ChatGPT Image 2 lip 2026, 22_32_26.png';
import contactImage from '../../images/kontakt.png';

const MESSENGER_CHAT_URL = 'https://www.facebook.com/profile.php?id=61591144089900&mibextid=wwXIfr&rdid=LMErxcEybUPiCe0v&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F191Mh71ZZi%2F%3Fmibextid%3DwwXIfr#';

function openRegisterModal() {
  window.dispatchEvent(
    new CustomEvent('nastomatma:open-auth', {
      detail: { mode: 'register' },
    }),
  );
}

function openContactModal(mode = 'email') {
  window.dispatchEvent(
    new CustomEvent('nastomatma:open-contact', {
      detail: { mode },
    }),
  );
}

const tutors = [
  {
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria Energetyki',
    school: '(Politechnika)',
    color: 'bg-orange-700',
    text: 'Specjalizuję się w przygotowaniu do matury oraz w tłumaczeniu trudnych zagadnień w prosty i zrozumiały sposób.',
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
    name: 'Hubert',
    initial: 'H',
    field: 'Budownictwo',
    school: '(Politechnika)',
    color: 'bg-orange-600',
    text: 'Pomagam zrozumieć matematykę krok po kroku i pokazuję, że da się ją polubić.',
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

const heroBenefits = [
  {
    icon: <GraduationCapIcon className="h-5 w-5" />,
    title: 'Indywidualne podejście',
    text: 'do każdego ucznia',
  },
  {
    icon: <StarIcon className="h-5 w-5" />,
    title: 'Proste wyjaśnienia',
    text: 'i skuteczne metody',
  },
  {
    icon: <TrendingUpIcon className="h-5 w-5" />,
    title: 'Lepsze wyniki',
    text: 'i więcej pewności siebie',
  },
];

const stats = [
  { value: '40+', label: 'Absolwentów pod\nnaszą opieką', icon: 'cap' },
  { value: '5+', label: 'Lat doświadczenia\ndydaktycznego', icon: 'calendar' },
  { value: 'Kl. 1-8', label: '+ LO / Matura\nPoziomy nauczania\ni programy', icon: 'book' },
  { value: '100%', label: 'Zdanych egzaminów\npaństwowych', icon: 'award' },
];

const steps = [
  {
    number: '01',
    title: 'Rozmowa wstępna',
    text: 'Poznajemy cel, poziom ucznia i największe trudności.',
    icon: 'chat',
  },
  {
    number: '02',
    title: 'Wybór korepetytora',
    text: 'Dobieramy nauczyciela najlepiej dopasowanego do ucznia.',
    icon: 'tutor',
  },
  {
    number: '03',
    title: 'Dobór pakietu lekcji',
    text: 'Ustalamy liczbę zajęć i harmonogram nauki.',
    icon: 'calendar',
  },
  {
    number: '04',
    title: 'Śledź postępy online',
    text: 'Po lekcjach widzisz raporty, komentarze i efekty.',
    icon: 'chart',
  },
];

const researchCards = [
  {
    value: 74,
    color: '#9f5f2c',
    icon: 'users',
    text: 'rodziców zgłasza, że tempo szkolne jest niedopasowane do dziecka (CBOS)',
  },
  {
    value: 89,
    color: '#27282d',
    icon: 'star',
    text: 'naszych uczniów przyznaje, że polubiło matematykę dzięki podejściu 1:1',
  },
  {
    value: 95,
    color: '#cfa178',
    icon: 'heart',
    text: 'rodziców odczuwa znacznie mniejszy stres przy odrabianiu zadań domowych',
  },
];

const packages = [
  {
    name: 'START',
    price: 99,
    frequency: '1x w tygodniu',
    monthly: '≈ 396 zł / miesiąc (4 lekcje)',
    button: 'Zapisz się na START',
    features: [
      '1 godzina zegarowa tygodniowo',
      'Dla uczniów od 1 klasy SP do Matury',
      'Dostęp do panelu ucznia/rodzica',
      'Stały kontakt z wybranym tutorem',
      'Uzupełnianie bieżących zaległości',
    ],
  },
  {
    name: 'PLUS',
    price: 89,
    frequency: '2x w tygodniu',
    monthly: '≈ 712 zł / miesiąc (8 lekcji)',
    button: 'Zapisz się na PLUS',
    popular: true,
    features: [
      '2 godziny zegarowe tygodniowo',
      'Maksymalne przyspieszenie postępów',
      'Dostęp do panelu ucznia/rodzica',
      'Indywidualne zadania domowe',
      'Rekomendowany do systematycznej nauki',
    ],
  },
  {
    name: 'INTENSIV',
    price: 79,
    frequency: '3x w tygodniu',
    monthly: '≈ 948 zł / miesiąc (12 lekcji)',
    button: 'Zapisz się na INTENSIV',
    features: [
      '3 godziny zegarowe tygodniowo',
      'Kompleksowe przygotowanie egzaminacyjne',
      'Dostęp do panelu ucznia/rodzica',
      'Próbne arkusze i symulacje CKE',
      'Praca nad najtrudniejszymi zagadnieniami',
    ],
  },
];

const recommendationMap = {
  'Niedostateczny (1)': {
    title: 'Pakiet INTENSIV',
    description: 'Przy dużych zaległościach najlepiej zacząć intensywnie, aby szybko odbudować podstawy i pewność siebie.',
    tutor: 'Hubert',
    subject: 'Matematyka podstawowa',
  },
  'Dopuszczający (2)': {
    title: 'Pakiet PLUS',
    description: 'Dla uporządkowania zaległości i regularnego nadrabiania materiału najlepiej sprawdzi się PLUS.',
    tutor: 'Hubert',
    subject: 'Matematyka, geometria',
  },
  'Dostateczny (3)': {
    title: 'Pakiet START',
    description: 'Dla regularnego wsparcia szkolnego pakiet START będzie idealnym wyborem.',
    tutor: 'Hubert',
    subject: 'Matematyka, Fizyka',
  },
  'Dobry (4)': {
    title: 'Pakiet PLUS',
    description: 'Dla szybszych postępów i pracy nad pewnością na lekcji wybierz PLUS.',
    tutor: 'Kuba',
    subject: 'Matematyka rozszerzona',
  },
  'Bardzo dobry (5)': {
    title: 'Pakiet INTENSIV',
    description: 'Dla ambitnego celu egzaminacyjnego najlepiej sprawdzi się INTENSIV.',
    tutor: 'Kuba',
    subject: 'Matura, analiza',
  },
};

const tutorProfiles = [
  {
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria Energetyki',
    year: 'III rok Politechniki',
    theme: 'navy',
    description:
      'Wspiera uczniów w zrozumieniu matematyki od najmłodszych lat, ale jego żywiołem są matury rozszerzone, analiza matematyczna i fizyka. Potrafi przełożyć skomplikowane twierdzenia na życiowe przykłady z termodynamiki i fizyki stosowanej. Gwarantuje przełamanie barier mentalnych przed matematyką.',
    tags: [
      'Matematyka SP i LO',
      'Matura Rozszerzona',
      'Analiza Matematyczna',
      'Fizyka i Mechanika płynów',
      'Równania Różniczkowe',
    ],
  },
  {
    name: 'Hubert',
    initial: 'H',
    field: 'Budownictwo',
    year: 'II rok Politechniki',
    theme: 'orange',
    description:
      'Wspaniale nawiązuje kontakt z dziećmi z klas podstawowych oraz maturzystami przygotowującymi się do poziomu podstawowego. Na lekcjach zawsze posługuje się rysunkiem i wyobraźnią przestrzenną. Opanował do perfekcji tłumaczenie geometrii, statyki oraz wytrzymałości materiałów.',
    tags: [
      'Matematyka podstawowa',
      'Geometria i stereometria',
      'Mechanika budowli',
      'Wytrzymałość materiałów',
      'Egzamin Ósmoklasisty',
    ],
  },
];

const educationLevels = [
  {
    title: 'Klasy 1-3',
    subtitle: 'Szkoła podstawowa',
    icon: 'sprout',
    active: true,
    description: 'Pierwsze kroki w matematyce w przyjaznej i zrozumiałej formie.',
    bullets: [
      'Rozwijanie logicznego myślenia',
      'Podstawowe operacje arytmetyczne',
      'Zrozumienie miar, wielkości i podstaw geometrii',
      'Przygotowanie do kolejnych etapów nauki',
    ],
  },
  {
    title: 'Klasy 4-6',
    subtitle: 'Szkoła podstawowa',
    icon: 'ruler',
    description: 'Rozbudowa wiedzy i umiejętności matematycznych.',
    bullets: [
      'Działania na liczbach naturalnych i ułamkach',
      'Procenty, proporcje i skala',
      'Geometria płaska i przestrzenna',
      'Przygotowanie do egzaminu ósmoklasisty',
    ],
  },
  {
    title: 'Klasy 7-8',
    subtitle: 'SP + Egzamin 8-klasisty',
    icon: 'bars',
    description: 'Utrwalenie i poszerzenie wiedzy. Skuteczne przygotowanie do egzaminu.',
    bullets: [
      'Wyrażenia algebraiczne i równania',
      'Funkcje i zależności',
      'Geometria i twierdzenie Pitagorasa',
      'Powtórki i arkusze egzaminacyjne',
    ],
  },
  {
    title: 'Liceum / Technikum',
    subtitle: 'Przygotowanie bieżące',
    icon: 'line',
    description: 'Wsparcie w nauce na bieżąco, przygotowanie do sprawdzianów i kartkówek.',
    bullets: [
      'Algebra i funkcje',
      'Geometria analityczna',
      'Trygonometria',
      'Rachunek prawdopodobieństwa i statystyka',
    ],
  },
  {
    title: 'Matura',
    subtitle: 'Podstawowa i rozszerzona',
    icon: 'cap',
    description: 'Kompleksowe przygotowanie do matury na poziomie podstawowym i rozszerzonym.',
    bullets: [
      'Zakres podstawowy i rozszerzony',
      'Strategie rozwiązywania zadań',
      'Arkusze maturalne CKE',
      'Indywidualny plan przygotowań',
    ],
  },
];

export function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalMode, setContactModalMode] = useState('email');

  useEffect(() => {
    const handleOpenContact = (event) => {
      setContactModalMode(event.detail?.mode === 'messenger' ? 'messenger' : 'email');
      setIsContactModalOpen(true);
    };

    window.addEventListener('nastomatma:open-contact', handleOpenContact);

    return () => {
      window.removeEventListener('nastomatma:open-contact', handleOpenContact);
    };
  }, []);

  return (
    <>
      <div className="relative overflow-hidden bg-[#fffdf9]">
        <div className="absolute inset-x-0 top-0 h-px bg-zinc-100" />

        <section className="relative">
          <div className="relative mx-auto grid w-full max-w-[88rem] items-center gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[570px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="relative z-10">
              <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-normal text-[#07463f] sm:text-6xl lg:text-7xl">
                Matematyka,
                <br />
                która ma sens
                <br />
                <span className="relative inline-block text-[#f0b544]">
                  i daje pewność
                  <span className="absolute -bottom-1 left-2 h-2 w-[94%] rounded-full bg-[#f6df9e]/80" />
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-8 text-slate-700 sm:text-lg">
                Uczymy matematyki na poziomie szkoły podstawowej i średniej w
                przyjaznej atmosferze. Zrozumienie zamiast wkuwania - efekty
                zamiast stresu.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#007566] px-6 py-4 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.2)] transition hover:bg-[#005d51]"
                >
                  <SearchIcon className="h-5 w-5" />
                  Zacznij teraz
                </button>
                <a
                  href="#cennik"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-[#007566] bg-white px-7 py-4 text-base font-extrabold text-[#07463f] transition hover:bg-[#eff8f5]"
                >
                  Zobacz ofertę
                </a>
              </div>

              <div className="mt-9 grid gap-4 text-sm text-slate-700 sm:grid-cols-3 lg:max-w-2xl">
                {heroBenefits.map((benefit) => (
                  <HeroBenefit key={benefit.title} benefit={benefit} />
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[650px]">
              <div className="absolute -left-8 top-28 hidden grid-cols-4 gap-4 lg:grid">
                {Array.from({ length: 20 }).map((_, index) => (
                  <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
                ))}
              </div>
              <img
                src={heroStudentImage}
                alt="Uczennica rozwiązująca zadania z matematyki przy laptopie"
                className="relative z-10 w-full object-contain"
              />
            </div>
          </div>
        </section>
      </div>
      <Corepetitors />
      <HowToStart />
      <ProgramSection />
      <PriceList />
      <Contact />
      {isContactModalOpen && (
        <ContactModal mode={contactModalMode} onClose={() => setIsContactModalOpen(false)} />
      )}
    </>
  );
}

function HeroBenefit({ benefit }) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e3f1ec] text-[#007566]">
        {benefit.icon}
      </span>
      <p className="text-xs font-semibold leading-5">
        <span className="block font-extrabold text-slate-800">{benefit.title}</span>
        {benefit.text}
      </p>
    </div>
  );
}

function StatsBar() {
  return (
    <section className="relative z-10 hidden px-6 pb-16 pt-2 lg:px-10 xl:block">
      <div className="relative mx-auto -mt-3 grid max-w-7xl gap-8 rounded-2xl border border-orange-700/20 bg-orange-700 px-6 py-8 text-white shadow-[0_18px_38px_rgba(39,40,45,0.12)] sm:px-8 lg:grid-cols-[1fr_2.75fr] lg:items-center lg:px-10">
        <div className="lg:max-w-md">
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-200">
              Dlaczego warto z nami?
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
              Sprawdzone rezultaty
            </h2>
            <p className="mt-4 max-w-md text-base font-medium leading-7 text-orange-100">
              Od lat pomagamy uczniom zrozumieć matematykę i osiągać świetne wyniki na egzaminach.
            </p>
            <DecorativeArrow className="absolute -bottom-2 right-3 hidden h-12 w-20 text-orange-200 md:block" />
          </div>
        </div>

        <div className="grid gap-0 divide-y divide-white/20 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="px-5 py-4 text-center lg:px-7">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50/35 text-orange-50 ring-1 ring-white/10">
                <StatIcon type={stat.icon} className="h-8 w-8" />
              </span>
              <p className="mt-4 text-3xl font-black leading-none text-orange-100 sm:text-4xl">{stat.value}</p>
              <p className="mx-auto mt-3 max-w-[10rem] whitespace-pre-line text-sm font-semibold leading-6 text-white/85">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DecorativeArrow({ className }) {
  return (
    <svg viewBox="0 0 96 52" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
        d="M7 28c21 13 44 6 65-17"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m67 10 15-5-4 15"
      />
    </svg>
  );
}

function StatIcon({ type, className }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 3v4m10-4v4M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 8h2m4 0h2m-8 4h2m4 0h2"
        />
      </svg>
    );
  }

  if (type === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Zm0 0A3.5 3.5 0 0 1 7.5 9H20"
        />
      </svg>
    );
  }

  if (type === 'award') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.5 14.5 17 22l-5-3-5 3 1.5-7.5M17 8A5 5 0 1 1 7 8a5 5 0 0 1 10 0Zm-6.5 0 1 1 2-2"
        />
      </svg>
    );
  }

  return <GraduationCapIcon className={className} />;
}

function HowToStart() {
  return (
    <section id="jak-to-dziala" className="relative overflow-hidden bg-[#fbfaf7] px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-10">
      <div className="absolute left-[8%] top-16 hidden grid-cols-4 gap-5 opacity-80 lg:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
        ))}
      </div>
      <div className="absolute -right-14 -top-16 hidden h-48 w-72 rotate-[-18deg] rounded-[48%] bg-[#fff0cf] lg:block">
        <span className="absolute bottom-14 left-20 text-lg font-black text-[#0a604f]">
          a² + b² = c²
        </span>
      </div>
      <div className="absolute -right-10 top-20 hidden h-56 w-32 rounded-[50%] border-l border-[#c6d7ce] lg:block" />

      <div className="relative mx-auto max-w-[86rem]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8fc1b2]">
            Proces
          </p>
          <h2 className="relative mx-auto mt-2 inline-block text-4xl font-black leading-tight text-[#07463f] sm:text-6xl">
            Jak działamy
            <span className="absolute -bottom-1 left-2 h-2 w-[94%] rounded-full bg-[#f6c65f]" />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-slate-700">
            Prosty i skuteczny proces od pierwszego zgłoszenia do pełnego
            opanowania materiału.
          </p>
        </div>

        <div className="relative mt-10 grid gap-8 sm:mt-14 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-5 hidden border-t-2 border-dashed border-[#c6d7ce] lg:block" />
          {steps.map((step) => (
            <ProcessStep key={step.number} step={step} />
          ))}
        </div>

        <ProcessStatsPanel />
      </div>
    </section>
  );
}

function ProcessStep({ step }) {
  return (
    <article className="relative text-center">
      <div className="relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#006b5f] text-sm font-black text-white shadow-[0_12px_24px_rgba(0,107,95,0.22)]">
        {step.number}
      </div>
      <div className="mt-5 px-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f1ea] text-[#006b5f] sm:h-24 sm:w-24">
          <StepIcon type={step.icon} />
        </div>
        <h3 className="mt-5 text-xl font-black text-[#07463f]">{step.title}</h3>
        <p className="mx-auto mt-3 max-w-[15rem] text-sm font-medium leading-6 text-slate-700">
          {step.text}
        </p>
        <span className="mx-auto mt-4 block h-1 w-14 rounded-full bg-[#f6c65f]" />
      </div>
    </article>
  );
}

function ProcessStatsPanel() {
  return (
    <div className="mt-12 rounded-2xl bg-[linear-gradient(135deg,#164f36,#0b5f4f)] px-6 py-8 text-white shadow-[0_20px_45px_rgba(9,64,47,0.18)] sm:mt-16 sm:px-10 lg:grid lg:grid-cols-[1.2fr_2.2fr] lg:items-center lg:px-14 lg:py-12">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.32em] text-white/60">
          Dlaczego warto z nami?
        </p>
        <h3 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
          Sprawdzone rezultaty
        </h3>
        <p className="mt-5 max-w-md text-base font-medium leading-8 text-white/72">
          Od lat pomagamy uczniom zrozumieć matematykę i osiągać świetne wyniki na egzaminach.
        </p>
      </div>

      <div className="mt-8 grid gap-0 divide-y divide-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:mt-0 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.value} className="px-4 py-5 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center text-white/58">
              <StatIcon type={stat.icon} className="h-7 w-7" />
            </span>
            <p className="mt-3 text-4xl font-black leading-none text-white">{stat.value}</p>
            <p className="mx-auto mt-3 max-w-[9rem] whitespace-pre-line text-sm font-medium leading-5 text-white/70">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepIcon({ type }) {
  if (type === 'chat') {
    return <ChatBubblesIcon className="h-10 w-10 sm:h-14 sm:w-14" />;
  }

  if (type === 'tutor') {
    return <TutorCheckIcon className="h-10 w-10 sm:h-14 sm:w-14" />;
  }

  if (type === 'calendar') {
    return <CalendarCheckIcon className="h-10 w-10 sm:h-14 sm:w-14" />;
  }

  return <ProgressScreenIcon className="h-10 w-10 sm:h-14 sm:w-14" />;
}

function TutorCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 20v-1.5c0-2.5-2.2-4.5-5-4.5s-5 2-5 4.5V20m8-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2.5 9.5a4.5 4.5 0 1 0 6 6M17 19l1.4 1.4 3-3.3"
      />
    </svg>
  );
}

function CalendarCheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 3v4m10-4v4M5 6h14a2 2 0 0 1 2 2v10.5M5 10h16M9 14h2m4 0h1M6 21h7M5 6v13a2 2 0 0 0 2 2m10-2 1.5 1.5 3-3.5"
      />
    </svg>
  );
}

function ProgressScreenIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5h16v11H4V5Zm5 15h6m-3-4v4m-5-7 3-3 2 2 4-5m0 0v4m0-4h-4"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
        d="M19 12H5m6-6-6 6 6 6"
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
        strokeLinejoin="round"
        strokeWidth="2.3"
        d="M18 6 6 18M6 6l12 12"
      />
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
        d="m20 20-4.2-4.2M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
      />
    </svg>
  );
}

function PackageIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v8.5m8-4L12 12 4 7.5m4 2.3 8-4.5"
      />
    </svg>
  );
}

function PaperPlaneIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="m21 3-7.5 18-4-8.5L3 9l18-6Zm-11.5 9.5L21 3"
      />
    </svg>
  );
}

function GraduationCapIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="m3 8.5 9-4 9 4-9 4-9-4Zm4 2.5v4.2c0 1.7 2.2 3.1 5 3.1s5-1.4 5-3.1V11"
      />
    </svg>
  );
}

function TeacherIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path fill="#fff" d="M0 0h64v64H0z" />
      <path fill="none" stroke="#27282d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 55v-4c0-7 5-13 12-13s12 6 12 13v4M23 23a9 9 0 0 0 18 0M20 23h24M24 20a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm16 0a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
      <path fill="none" stroke="#9f5f2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M29 39v8l3 3 3-3v-8" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path fill="none" stroke="#27282d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 14h32a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4Zm-4 13h40M22 8v12M42 8v12" />
      <path fill="none" stroke="#9f5f2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M38 43a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm5 0 3 3 6-7" />
      <path fill="#27282d" d="M20 35h4v4h-4zm10 0h4v4h-4zm-10 10h4v4h-4zm10 0h4v4h-4z" />
    </svg>
  );
}

function ChartIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path fill="none" stroke="#27282d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v44h44M22 46V34m10 12V28m10 18V22m10 24V16" />
      <path fill="none" stroke="#9f5f2c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m20 34 9-8 8 7 14-16m0 0v9m0-9h-9" />
    </svg>
  );
}

function WhyUs() {
  const [classSize, setClassSize] = useState(30);
  const publicSchoolSeconds = Math.round((45 / classSize) * 60);
  const wholeMinutes = Math.floor(publicSchoolSeconds / 60);
  const seconds = publicSchoolSeconds % 60;
  const benefits = [
    {
      icon: <StopwatchIcon className="h-8 w-8" />,
      title: 'Indywidualne tempo',
      text: 'Pracujemy w tempie dopasowanym do Twojego dziecka.',
    },
    {
      icon: <TrendingUpIcon className="h-8 w-8" />,
      title: 'Szybsze postępy',
      text: 'Skupiamy się na tym, co naprawdę blokuje wyniki.',
    },
    {
      icon: <BrainIcon className="h-8 w-8" />,
      title: 'Lepsze zrozumienie',
      text: 'Wyjaśniamy w sposób prosty i logiczny.',
    },
    {
      icon: <ConfidenceIcon className="h-8 w-8" />,
      title: 'Większa pewność siebie',
      text: 'Regularne sukcesy budują wiarę we własne możliwości.',
    },
    {
      icon: <DocumentIcon className="h-8 w-8" />,
      title: 'Stały monitoring',
      text: 'Rodzic otrzymuje raporty i konkretne rekomendacje.',
    },
  ];

  return (
    <section id="dlaczego-my" className="bg-orange-50 pb-12 pt-8 sm:pb-20 sm:pt-12">
      <div className="overflow-hidden bg-orange-50">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.92fr_1.08fr]">
          <div className="px-4 py-9 sm:px-10 sm:py-12 lg:px-14">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-600 sm:tracking-[0.45em]">
              Badania i analizy
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-slate-950 sm:mt-6 sm:text-5xl">
              Dlaczego nauka indywidualna <span className="text-orange-600">działa?</span>
            </h2>
            <span className="mt-5 block h-1 w-10 rounded-full bg-orange-600 sm:mt-6 sm:w-12" />
            <p className="mt-5 max-w-lg text-sm font-medium leading-6 text-slate-600 sm:mt-7 sm:text-base sm:leading-8">
              W klasie liczącej 25-30 uczniów nauczyciel musi podzielić uwagę między wszystkich. Sprawdź, ile czasu realnie przypada na jedno dziecko podczas lekcji.
            </p>
            <div className="mt-6 flex max-w-md items-center gap-3 rounded-full bg-orange-50 px-4 py-3 sm:mt-8 sm:gap-4 sm:px-5 sm:py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 sm:h-12 sm:w-12">
                <UsersIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <p className="text-xs font-bold leading-5 text-slate-700 sm:text-sm sm:leading-6">
                Indywidualne podejście to większe zrozumienie, szybsze postępy i pewność siebie.
              </p>
            </div>
          </div>
          <div className="relative min-h-[240px] overflow-hidden sm:min-h-[360px]">
            <img
              src={individualLearningImage}
              alt="Korepetytorka pomaga uczniowi w rozwiązywaniu zadań z matematyki"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-orange-50 via-orange-50/85 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-orange-50 via-orange-50/70 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-orange-50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-orange-50 to-transparent" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div id="symulator-uwagi" className="relative z-10 -mt-8 rounded-2xl border border-orange-100 bg-white px-4 py-6 shadow-[0_18px_42px_rgba(39,40,45,0.08)] sm:-mt-10 sm:px-10 sm:py-8 lg:px-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 sm:h-16 sm:w-16">
              <StopwatchIcon className="h-7 w-7 sm:h-9 sm:w-9" />
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-950 sm:text-3xl">
                Sprawdź ile czasu nauczyciel ma dla Twojego dziecka
              </h3>
              <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
                Użyj suwaka, aby wybrać wielkość klasy szkolnej. Zobacz, ile minut z 45-minutowej lekcji przypada statystycznie na jedno dziecko.
              </p>
            </div>
          </div>

          <div className="mt-7 sm:mt-10">
            <div className="mb-4 flex flex-col justify-between gap-2 text-sm font-black text-slate-950 sm:mb-5 sm:flex-row sm:items-center sm:gap-3 sm:text-base">
              <span>Liczba uczniów w klasie:</span>
              <span className="inline-flex items-center gap-3 text-orange-600">
                <UsersIcon className="h-5 w-5" />
                {classSize} uczniów
              </span>
            </div>
            <div className="relative pb-8">
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                {[10, 15, 20, 25, 30, 35, 40].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={classSize}
                onChange={(event) => setClassSize(Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-orange-600"
                aria-label="Liczba uczniów w klasie"
              />
            </div>

            <div className="grid items-stretch gap-4 sm:gap-6 lg:grid-cols-[1fr_auto_1fr]">
              <TimeComparisonCard
                eyebrow="Lekcja w szkole publicznej"
                value={`${wholeMinutes} min ${seconds.toString().padStart(2, '0')} sek`}
                text={`Twoje dziecko ma lekcji w ${classSize}-osobowej klasie.`}
              />
              <div className="flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-black uppercase text-slate-700 sm:h-14 sm:w-14 sm:text-sm">
                  vs
                </span>
              </div>
              <TimeComparisonCard
                eyebrow="Lekcja indywidualna"
                value="45 min"
                text="Tyle czasu poświęcamy Twojemu dziecku podczas lekcji indywidualnej."
                highlighted
              />
            </div>

            <p className="mt-7 max-w-4xl text-xs font-medium leading-5 text-slate-500">
              *Przy {classSize} uczniach nauczyciel realizuje materiał sztywno pod średnią grupy. Źródło: raporty dydaktyczne PISA oraz badania nad Problem 2 Sigma Blooma.
            </p>
          </div>
        </div>

        <div className="grid gap-0 overflow-hidden rounded-b-2xl border-x border-b border-orange-100 bg-white shadow-[0_18px_42px_rgba(39,40,45,0.05)] sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="border-b border-orange-100 px-5 py-7 text-center last:border-b-0 sm:border-r sm:px-7 sm:py-12 lg:border-b-0 lg:py-14">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 sm:h-16 sm:w-16">
                {benefit.icon}
              </span>
              <h3 className="mt-4 text-sm font-black text-slate-950 sm:mt-7 sm:text-base">{benefit.title}</h3>
              <p className="mt-3 text-xs font-medium leading-5 text-slate-500 sm:mt-5 sm:text-sm sm:leading-6">{benefit.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-orange-100 bg-white px-5 py-6 shadow-[0_16px_34px_rgba(39,40,45,0.06)] sm:mt-9 sm:px-8 sm:py-7">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 sm:h-16 sm:w-16">
                <TrophyIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </span>
              <p className="text-base font-bold text-slate-700 sm:text-xl">
                <span className="text-2xl font-black text-orange-600 sm:text-3xl">98%</span> uczniów osiąga lepsze wyniki dzięki korepetycjom indywidualnym 1:1.
              </p>
            </div>
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-orange-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700 sm:w-auto sm:gap-4 sm:px-8 sm:py-5 sm:text-base"
            >
              Umów lekcję próbną
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeComparisonCard({ eyebrow, value, text, highlighted = false }) {
  return (
    <article className={`rounded-lg border px-5 py-5 sm:px-7 sm:py-7 ${highlighted ? 'border-orange-200 bg-orange-50/40' : 'border-zinc-200 bg-white'}`}>
      <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600 sm:gap-3 sm:text-xs sm:tracking-[0.28em]">
        {highlighted ? <GraduationCapIcon className="h-5 w-5" /> : <SchoolIcon className="h-5 w-5" />}
        {eyebrow}
      </p>
      <p className={`mt-4 text-3xl font-black leading-none sm:mt-5 sm:text-5xl ${highlighted ? 'text-orange-600' : 'text-slate-950'}`}>
        {value}
      </p>
      <p className="mt-3 max-w-md text-xs font-medium leading-5 text-slate-500 sm:mt-4 sm:text-sm sm:leading-6">
        {text}
      </p>
    </article>
  );
}

function MetricCard({ eyebrow, value, description, variant }) {
  const isOrange = variant === 'orange';

  return (
    <article
      className={`rounded-lg border bg-white px-8 py-8 ${
        isOrange ? 'border-orange-300 bg-orange-50/30' : 'border-zinc-200'
      }`}
    >
      <p className={`flex items-center gap-4 text-sm font-black uppercase tracking-[0.25em] ${isOrange ? 'text-orange-600' : 'text-zinc-500'}`}>
        {isOrange ? <GraduationCapIcon className="h-7 w-7" /> : <SchoolIcon className="h-7 w-7" />}
        {eyebrow}
      </p>
      <p className={`mt-6 text-5xl font-black sm:text-6xl ${isOrange ? 'text-orange-600' : 'text-slate-950'}`}>
        {value}
      </p>
      <p className={`mt-5 text-base font-bold ${isOrange ? 'text-orange-500' : 'text-slate-400'}`}>
        {description}
      </p>
    </article>
  );
}

function ResearchCard({ card }) {
  return (
    <article className="rounded-xl bg-white px-6 py-8 shadow-[0_14px_32px_rgba(15,23,42,0.08)] sm:px-8">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <PercentageRing value={card.value} color={card.color} />
        <div>
          <p className="text-5xl font-black sm:text-6xl" style={{ color: card.color }}>
            {card.value}%
          </p>
          <p className="mt-3 max-w-xs text-base font-medium leading-7 text-slate-600">
            {card.text}
          </p>
        </div>
      </div>
      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        <SmallResearchIcon type={card.icon} />
      </div>
    </article>
  );
}

function PercentageRing({ value, color }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f0ece7" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-slate-950">
        {value}%
      </span>
    </div>
  );
}

function SmallResearchIcon({ type }) {
  if (type === 'star') {
    return <StarIcon className="h-8 w-8 text-slate-950" />;
  }

  if (type === 'heart') {
    return <HeartIcon className="h-8 w-8 text-emerald-600" />;
  }

  return <UsersIcon className="h-8 w-8 text-orange-600" />;
}

function TrendingUpIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M4 19h16M6 15l4-4 3 3 6-7m0 0v5m0-5h-5"
      />
    </svg>
  );
}

function BrainIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M9 4.5A3 3 0 0 0 4.5 7c0 .6.2 1.2.5 1.7A3.5 3.5 0 0 0 5.5 15 3.5 3.5 0 0 0 9 19.5V4.5Zm6 0A3 3 0 0 1 19.5 7c0 .6-.2 1.2-.5 1.7a3.5 3.5 0 0 1-.5 6.3 3.5 3.5 0 0 1-3.5 4.5V4.5ZM9 9H6.8M15 9h2.2M9 14H6.8M15 14h2.2"
      />
    </svg>
  );
}

function ConfidenceIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M12 21s7-3.5 7-9V5l-7-3-7 3v7c0 5.5 7 9 7 9Zm-4-8 3 3 5-7"
      />
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M8 21h8m-4-4v4m-6-8a6 6 0 0 0 12 0V4H6v9Zm0-7H3v3a4 4 0 0 0 3 4m12-7h3v3a4 4 0 0 1-3 4"
      />
    </svg>
  );
}

function StopwatchIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M9 2h6m-3 4v5l3 3m5-3a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2.2-5.8 1.4-1.4"
      />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M7 3h7l4 4v14H7V3Zm7 0v5h5M10 12h5m-5 4h6"
      />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M16 19v-1.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5V19m8-12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm3 12v-1.2c0-1.5-1-2.8-2.5-3.4M17 4.4a3.3 3.3 0 0 1 0 6.2M5 19v-1.2c0-1.5 1-2.8 2.5-3.4M7 4.4a3.3 3.3 0 0 0 0 6.2"
      />
    </svg>
  );
}

function SchoolIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M4 21V10l8-5 8 5v11M8 21v-7h8v7M3 21h18M10 10h4"
      />
    </svg>
  );
}

function StarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
      />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M20.8 5.7a5 5 0 0 0-7.1 0L12 7.4l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.2a5 5 0 0 0 0-7.1Z"
      />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M9 12.5 11 15l4.5-5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
        strokeWidth="2.2"
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-5"
      />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-2-8 2 2"
      />
    </svg>
  );
}

function TargetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M12 21a9 9 0 1 1 8.5-12M12 17a5 5 0 1 1 4.5-7.2M12 13a1 1 0 1 1 0-2m5-4 3-3m-3 0h3v3"
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
        strokeWidth="2.2"
        d="M7 11V8a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm4 4v2"
      />
    </svg>
  );
}

function BarsIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        d="M5 20V10m7 10V4m7 16v-7M3 20h18"
      />
    </svg>
  );
}

function BoltIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"
      />
    </svg>
  );
}

function BoardIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M4 5h16v10H4V5Zm4 14h8M12 15v4m-5-7 3-3 2 2 4-4"
      />
    </svg>
  );
}

function TagMarkIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M6 4h12v16H6V4Zm4 5h4m-4 4h4m-4 4h2"
      />
    </svg>
  );
}

function RulerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="m4 20 16-16M8 16l-2-2m6-2-2-2m6-2-2-2M4 20h16V4"
      />
    </svg>
  );
}

function SproutIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
        d="M12 21v-8m0 0c-4 0-7-2.5-8-7 4-.5 7 1 8 7Zm0 0c4 0 7-2.5 8-7-4-.5-7 1-8 7Z"
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
        d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5"
      />
    </svg>
  );
}

function PhoneChatIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 8.5c.3 3.4 2.1 5.2 5.5 5.5l1.1-1.6-1.9-1-1 1c-1.1-.5-1.8-1.2-2.3-2.3l1-1-1-1.9L9 8.5Z"
      />
    </svg>
  );
}

function LaptopIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 5h14v10H5V5Zm-3 14h20l-3-4H5l-3 4Z"
      />
    </svg>
  );
}

function ChatBubblesIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 15H6l-3 3v-3a5 5 0 0 1-1-3.1C2 8.6 5.1 6 9 6s7 2.6 7 5.9-3.1 5.9-7 5.9c-.8 0-1.5-.1-2.2-.3"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 10c4.4 0 8 2.7 8 6 0 1.1-.4 2.1-1 3v3l-3-2.2c-1.1.2-2.2.2-3.4.1"
      />
    </svg>
  );
}

function PriceList() {
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
  const [selectedPricingGroupId, setSelectedPricingGroupId] = useState(pricingGroups[0].id);
  const selectedPricingGroup = pricingGroups.find((group) => group.id === selectedPricingGroupId) ?? pricingGroups[0];

  return (
    <section id="cennik" className="relative overflow-hidden bg-[#fbfaf7] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
      <div className="absolute left-[9%] top-16 hidden grid-cols-4 gap-5 opacity-80 lg:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
        ))}
      </div>
      <div className="absolute -right-14 -top-16 hidden h-48 w-72 rotate-[-18deg] rounded-[48%] bg-[#fff0cf] lg:block" />
      <div className="absolute -right-8 top-20 hidden h-56 w-32 rounded-[50%] border-l border-[#c6d7ce] lg:block" />

      <div className="relative mx-auto max-w-[86rem]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8fc1b2]">
            Cennik Pakiety
          </p>
          <h2 className="relative mx-auto mt-2 inline-block text-4xl font-black leading-tight text-[#07463f] sm:text-6xl">
            Elastyczne Pakiety Lekcyjne
            <span className="absolute -bottom-1 left-2 h-2 w-[94%] rounded-full bg-[#f6c65f]" />
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-7 text-slate-700 sm:text-lg">
            Im więcej lekcji w tygodniu, tym niższa stawka za każdą godzinę.
            Bez długoterminowych umów - płacisz miesięcznie i rezygnujesz kiedy chcesz.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <InfoIcon className="h-5 w-5" />
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
            <PricingCard key={item.name} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ item }) {
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
          <StarIcon className="h-4 w-4" />
          Najpopularniejszy
        </div>
      )}

      <div className="flex items-start gap-5">
        <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${isPopular ? 'bg-[#fff0cf] text-[#d39312]' : 'bg-[#e8f1ea] text-[#007566]'}`}>
          <PricingIcon type={item.icon} />
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
            <CheckCircleIcon className={`mt-0.5 h-5 w-5 shrink-0 ${isPopular ? 'text-[#f0b544]' : 'text-[#007566]'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={openRegisterModal}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#164f36,#0b5f4f)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(9,64,47,0.18)] transition hover:brightness-110"
      >
        Wybieram pakiet
      </button>
    </article>
  );
}

function PricingIcon({ type }) {
  if (type === 'line') {
    return <TrendingUpIcon className="h-8 w-8" />;
  }

  if (type === 'target') {
    return <TargetIcon className="h-8 w-8" />;
  }

  return <SproutIcon className="h-8 w-8" />;
}

function LegacyPriceList() {
  const [selectedGrade, setSelectedGrade] = useState('Dopuszczający (2)');
  const [selectedGoal, setSelectedGoal] = useState('Bieżąca pomoc / spokój przy lekcjach');
  const recommendation = recommendationMap[selectedGrade];

  return (
    <section id="legacy-cennik" className="relative overflow-hidden bg-[#fcfaf7] px-4 py-12 sm:px-6 sm:py-20 lg:px-10">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(159,95,44,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(159,95,44,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-orange-50/80 blur-3xl" />
      <div className="relative mx-auto max-w-7xl rounded-2xl border-2 border-orange-600/45 px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
        <div className="relative overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-600 sm:text-sm sm:tracking-[0.45em]">
              Cennik Pakiety
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:mt-5 sm:text-6xl lg:text-7xl">
              Elastyczne Pakiety Lekcyjne
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-500 sm:mt-6 sm:text-lg sm:leading-8">
              Im więcej lekcji w tygodniu, tym niższa stawka za każdą godzinę.
              Bez długoterminowych umów - płacisz miesięcznie i rezygnujesz kiedy chcesz.
            </p>

            <div className="mt-5 inline-flex max-w-full items-start gap-2 rounded-md bg-orange-50 px-4 py-3 text-xs font-semibold leading-5 text-slate-400 sm:mt-7 sm:items-center sm:gap-3 sm:px-5 sm:text-sm sm:leading-6">
              <InfoIcon className="h-4 w-4 shrink-0 text-orange-500 sm:h-5 sm:w-5" />
              <span>Wszystkie ceny podane są w przeliczeniu na 60-minutowe zajęcia indywidualne.</span>
            </div>

            <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-8 xl:grid-cols-3">
              {packages.map((item) => (
                <LegacyPricingCard key={item.name} item={item} />
              ))}
            </div>

          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white px-4 py-7 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:mt-16 sm:px-12 sm:py-10">
          <h3 className="flex flex-col gap-3 text-base font-black uppercase tracking-[0.1em] text-slate-950 sm:flex-row sm:items-center sm:gap-5 sm:text-xl sm:tracking-[0.18em]">
            <ClockIcon className="h-7 w-7 text-orange-600 sm:h-9 sm:w-9" />
            Kalkulacja stawek godzinowych
          </h3>
          <div className="mt-7 space-y-6 sm:mt-10 sm:space-y-8">
            {packages.map((item, index) => (
              <RateRow key={item.name} item={item} index={index} />
            ))}
          </div>
          <div className="mt-10 border-t border-zinc-200 pt-7">
            <p className="flex gap-3 text-sm font-medium leading-6 text-slate-400 sm:gap-4 sm:text-base sm:leading-7">
              <InfoIcon className="mt-1 h-5 w-5 shrink-0 text-orange-500 sm:h-6 sm:w-6" />
              <span>
                Średnia rynkowa cena indywidualnych korepetycji na poziomie szkoły
                średniej w aglomeracjach wynosi 110-160 zł/h. Nasze pakiety optymalizują Twój budżet.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-slate-950 px-5 py-7 text-white shadow-[0_18px_42px_rgba(15,23,42,0.16)] sm:mt-10 sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1px_1fr] lg:items-center">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <TargetIcon className="h-10 w-10 text-orange-600 sm:h-14 sm:w-14" />
                <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                  Dobierz idealny pakiet
                  <br />
                  dla dziecka
                </h3>
              </div>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-300 sm:mt-7 sm:text-lg sm:leading-8">
                Wybierz aktualną sytuację edukacyjną i cel, a nasz algorytm dobierze plan.
              </p>

              <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-300 sm:mb-3 sm:text-base">
                    Aktualne oceny dziecka:
                  </span>
                  <select
                    value={selectedGrade}
                    onChange={(event) => setSelectedGrade(event.target.value)}
                    className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none sm:px-5 sm:py-4 sm:text-base"
                  >
                    {Object.keys(recommendationMap).map((grade) => (
                      <option key={grade}>{grade}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-300 sm:mb-3 sm:text-base">
                    Twój cel nauczania:
                  </span>
                  <select
                    value={selectedGoal}
                    onChange={(event) => setSelectedGoal(event.target.value)}
                    className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none sm:px-5 sm:py-4 sm:text-base"
                  >
                    <option>Bieżąca pomoc / spokój przy lekcjach</option>
                    <option>Poprawa ocen i pewności siebie</option>
                    <option>Przygotowanie do egzaminu</option>
                  </select>
                </label>
              </div>

              <div className="mt-9 grid gap-5 text-sm font-bold text-slate-300 md:grid-cols-3">
                <Benefit icon={<LockIcon className="h-7 w-7" />} text="Spersonalizowany plan nauki" />
                <Benefit icon={<BarsIcon className="h-7 w-7" />} text="Oszczędność czasu i pieniędzy" />
                <Benefit icon={<UsersIcon className="h-7 w-7" />} text="Lepsze wyniki bez stresu" />
              </div>
            </div>

            <div className="hidden h-full w-px bg-slate-700 lg:block" />

            <article className="rounded-xl border border-slate-700 bg-white/5 px-5 py-6 sm:px-8 sm:py-8">
              <span className="inline-flex items-center gap-2 rounded bg-orange-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide sm:px-4 sm:py-2 sm:text-sm">
                <StarIcon className="h-4 w-4" />
                Rekomendacja
              </span>
              <p className="mt-5 text-sm font-semibold text-slate-300 sm:mt-7 sm:text-base">
                Najlepszy wybór dla Ciebie
              </p>
              <h3 className="mt-3 text-3xl font-black text-orange-600 sm:mt-4 sm:text-4xl">
                {recommendation.title}
              </h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
                {recommendation.description}
              </p>
              <div className="mt-8 border-t border-slate-700 pt-7">
                <p className="text-sm font-semibold text-slate-400 sm:text-base">
                  Sugerowany korepetytor:
                </p>
                <div className="mt-3 flex items-center gap-3 sm:mt-4 sm:gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-lg font-black sm:h-12 sm:w-12 sm:text-xl">
                    {recommendation.tutor[0]}
                  </span>
                  <div>
                    <p className="text-base font-black sm:text-lg">{recommendation.tutor}</p>
                    <p className="text-sm font-medium text-slate-300 sm:text-base">{recommendation.subject}</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={openRegisterModal}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-md bg-orange-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700 sm:mt-8 sm:gap-5 sm:px-8 sm:py-5 sm:text-lg"
              >
                Wybieram ten pakiet
                <ArrowRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <p className="sr-only">Wybrany cel nauczania: {selectedGoal}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function LegacyPricingCard({ item }) {
  const isPopular = item.popular;

  return (
    <article
      className={`relative flex h-full flex-col rounded-xl border px-5 py-7 shadow-[0_14px_32px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10 ${
        isPopular
          ? 'border-orange-600 bg-slate-950 text-white'
          : 'border-zinc-200 bg-white text-slate-950'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-orange-600 px-6 py-2 text-xs font-black uppercase tracking-wide text-white sm:px-8 sm:text-sm">
          <StarIcon className="h-4 w-4" />
          Najpopularniejszy
        </div>
      )}
      <p className={`text-xs font-black uppercase tracking-[0.18em] sm:text-sm sm:tracking-[0.2em] ${isPopular ? 'text-orange-500' : 'text-slate-700'}`}>
        {item.name}
      </p>
      <div className="mt-4 flex items-end gap-2 sm:mt-5 sm:gap-3">
        <span className="text-5xl font-black leading-none sm:text-7xl">{item.price}</span>
        <span className="mb-2 text-xl font-black sm:mb-3 sm:text-2xl">zł</span>
      </div>
      <p className={`mt-2 text-sm font-bold sm:mt-3 sm:text-base ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
        za godzinę ・ {item.frequency}
      </p>
      <p className={`mt-5 border-b pb-5 text-sm font-bold sm:mt-7 sm:pb-6 sm:text-base ${isPopular ? 'border-slate-700 text-slate-400' : 'border-zinc-200 text-slate-400'}`}>
        {item.monthly}
      </p>
      <ul className="mt-5 flex-1 space-y-3 sm:mt-7 sm:space-y-5">
        {item.features.map((feature) => (
          <li key={feature} className={`flex gap-2 text-sm font-bold leading-5 sm:gap-3 sm:text-base sm:leading-6 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500 sm:h-6 sm:w-6" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={openRegisterModal}
        className={`mt-7 inline-flex w-full items-center justify-center gap-3 rounded-md px-4 py-3.5 text-xs font-black transition sm:mt-10 sm:gap-5 sm:px-6 sm:py-4 sm:text-base ${
          isPopular
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'border-2 border-slate-700 text-slate-950 hover:border-slate-950'
        }`}
      >
        {item.button}
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </article>
  );
}

function RateRow({ item, index }) {
  const widths = ['88%', '82%', '72%'];
  const colors = ['bg-slate-950', 'bg-orange-600', 'bg-emerald-600'];
  const textColors = ['text-slate-950', 'text-orange-600', 'text-emerald-600'];

  return (
    <div className="grid gap-3 sm:gap-4 xl:grid-cols-[90px_110px_1fr_90px] xl:items-center">
      <p className="text-base font-black text-slate-950 sm:text-xl">{item.name}</p>
      <p className="text-sm font-semibold text-slate-400 sm:text-lg">{index + 1}h tydzień</p>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-100 sm:h-4">
        <div className={`h-full rounded-full ${colors[index]}`} style={{ width: widths[index] }} />
      </div>
      <p className={`text-left text-base font-black sm:text-xl xl:text-right ${textColors[index]}`}>{item.price} zł/h</p>
    </div>
  );
}

function Benefit({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-600 text-orange-600">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}


function Corepetitors(){
  const [areTutorCardsExpanded, setAreTutorCardsExpanded] = useState(false);
  const [isTutorExpansionForced, setIsTutorExpansionForced] = useState(false);

  useEffect(() => {
    const expandTutors = () => {
      setIsTutorExpansionForced(true);
      setAreTutorCardsExpanded(true);
    };

    window.addEventListener('nastomatma:expand-tutors', expandTutors);

    return () => {
      window.removeEventListener('nastomatma:expand-tutors', expandTutors);
    };
  }, []);

  useEffect(() => {
    const updateExpandedState = () => {
      if (isTutorExpansionForced) {
        return;
      }

      setAreTutorCardsExpanded(window.scrollY > window.innerHeight * 0.28);
    };

    updateExpandedState();
    window.addEventListener('scroll', updateExpandedState, { passive: true });
    window.addEventListener('resize', updateExpandedState);

    return () => {
      window.removeEventListener('scroll', updateExpandedState);
      window.removeEventListener('resize', updateExpandedState);
    };
  }, [isTutorExpansionForced]);

  return (
    <section id="korepetytorzy" className="bg-[#fffdf9]">
      <div className="relative px-4 pb-12 pt-0 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-[96rem]">
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
            {tutors.map((tutor) => (
              <TutorProfileCard
                key={tutor.name}
                tutor={tutor}
                isExpanded={areTutorCardsExpanded}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

function TutorProfileCard({ tutor, isExpanded }) {
  const details = [
    {
      icon: <GraduationCapIcon className="h-5 w-5" />,
      label: 'Poziomy',
      value: tutor.levels,
    },
    {
      icon: <PackageIcon className="h-5 w-5" />,
      label: 'Specjalizacja',
      value: tutor.specialization,
    },
    {
      icon: <HeartIcon className="h-5 w-5" />,
      label: 'Styl',
      value: tutor.style,
    },
  ];

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white px-6 py-7 shadow-[0_14px_28px_rgba(15,23,42,0.08)] transition-all duration-500 sm:px-8 sm:py-9 lg:px-10">
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

      <div
        className={`overflow-hidden transition-all duration-700 ease-out ${
          isExpanded
            ? 'mt-9 max-h-[820px] opacity-100'
            : 'mt-0 max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
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
            onClick={() => openContactModal()}
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

function TutorDetail({ icon, label, value }) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-3 border-orange-100 sm:grid-cols-[56px_1fr] sm:gap-4 sm:border-r sm:pr-4 last:border-r-0">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600 sm:h-14 sm:w-14">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-400">{label}</p>
        <p className="mt-1 whitespace-pre-line text-sm font-black leading-6 text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function ProgramSection() {
  const offerLevels = [
    {
      title: 'Klasy 1-3',
      subtitle: 'Szkoła podstawowa',
      icon: 'sprout',
      description: 'Pierwsze kroki w matematyce w przyjaznej i zrozumiałej formie.',
      bullets: [
        'Rozwijanie logicznego myślenia',
        'Podstawowe operacje arytmetyczne',
        'Zrozumienie miar i wielkości',
      ],
    },
    {
      title: 'Klasy 4-6',
      subtitle: 'Szkoła podstawowa',
      icon: 'line',
      description: 'Rozbudowa wiedzy i umiejętności matematycznych.',
      bullets: [
        'Działania na ułamkach',
        'Procenty, proporcje i skala',
        'Geometria płaska i przestrzenna',
      ],
    },
    {
      title: 'Klasy 7-8',
      subtitle: 'Egzamin ósmoklasisty',
      icon: 'bars',
      description: 'Intensywne przygotowanie do egzaminu na koniec szkoły podstawowej.',
      bullets: [
        'Wyrażenia algebraiczne i równania',
        'Funkcje liniowe',
        'Przygotowanie do egzaminu',
      ],
    },
    {
      title: 'Liceum / Matura',
      subtitle: 'Podstawa & rozszerzenie',
      icon: 'cap',
      description: 'Kompleksowe przygotowanie do matury z matematyki.',
      bullets: [
        'Analiza matematyczna',
        'Ciągi, granice, pochodne',
        'Matura podstawowa i rozszerzona',
      ],
    },
  ];

  return (
    <section id="program" className="relative overflow-hidden bg-[#fffdf9] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
      <div className="absolute left-[9%] top-16 hidden grid-cols-4 gap-5 opacity-80 lg:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
        ))}
      </div>
      <div className="absolute -right-14 -top-16 hidden h-48 w-72 rotate-[-18deg] rounded-[48%] bg-[#fff0cf] lg:block" />
      <div className="absolute -right-8 top-20 hidden h-56 w-32 rounded-[50%] border-l border-[#c6d7ce] lg:block" />

      <div className="relative mx-auto max-w-[86rem]">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8fc1b2]">
            Oferta
          </p>
          <h2 className="relative mx-auto mt-2 inline-block text-4xl font-black leading-tight text-[#07463f] sm:text-6xl">
            Poziomy nauczania
            <span className="absolute -bottom-1 left-2 h-2 w-[94%] rounded-full bg-[#f6c65f]" />
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-7 text-slate-700">
            Dopasowujemy materiał do każdego etapu edukacji.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-2 xl:grid-cols-4">
          {offerLevels.map((level) => (
            <EducationCard key={level.title} level={level} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-xl bg-[#eef5ee] px-6 py-6 shadow-[0_12px_28px_rgba(15,23,42,0.04)] sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dcebe2] text-[#007566]">
            <PaperPlaneIcon className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-lg font-black text-[#07463f]">
              Nie wiesz, który poziom będzie odpowiedni?
            </h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
              Skontaktuj się z nami - pomożemy dobrać najlepszą ścieżkę nauki.
            </p>
          </div>
          <button
            type="button"
            onClick={openContactModal}
            className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#007566] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.18)] transition hover:bg-[#005d51]"
          >
            <ChatBubblesIcon className="h-5 w-5" />
            Skontaktuj się
          </button>
        </div>
      </div>
    </section>
  );
}

function EducationCard({ level }) {
  return (
    <article className="flex min-h-[24rem] flex-col rounded-xl border border-zinc-100 bg-white px-6 py-8 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f1ea] text-[#007566]">
        <LevelIcon type={level.icon} />
      </div>
      <h3 className="mt-5 text-2xl font-black leading-tight text-[#07463f]">{level.title}</h3>
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#0a604f]">
        {level.subtitle}
      </p>
      <p className="mt-4 min-h-[4.5rem] text-sm font-medium leading-6 text-slate-700">
        {level.description}
      </p>
      <span className="mt-5 block h-1 w-12 rounded-full bg-[#f6c65f]" />
      <div className="mt-5 flex-1 text-left">
        <ul className="space-y-3 text-sm font-medium leading-6 text-slate-700">
          {level.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#007566]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function LevelIcon({ type }) {
  if (type === 'ruler') {
    return <RulerIcon className="h-8 w-8 sm:h-11 sm:w-11" />;
  }

  if (type === 'bars') {
    return <BarsIcon className="h-8 w-8 sm:h-11 sm:w-11" />;
  }

  if (type === 'line') {
    return <ChartIcon className="h-8 w-8 sm:h-11 sm:w-11" />;
  }

  if (type === 'cap') {
    return <GraduationCapIcon className="h-8 w-8 sm:h-11 sm:w-11" />;
  }

  return <SproutIcon className="h-8 w-8 sm:h-11 sm:w-11" />;
}
function Contact(){
  return (
    <section id="kontakt" className="relative overflow-hidden bg-[#fffdf9] px-4 pb-16 pt-14 text-slate-950 sm:px-6 sm:pb-24 sm:pt-20 lg:px-10">
      <div className="absolute left-[6%] top-[48%] hidden grid-cols-4 gap-5 opacity-80 lg:grid">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="h-2 w-2 rounded-full bg-[#b7d5c8]" />
        ))}
      </div>

      <div className="relative mx-auto max-w-[78rem]">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div className="lg:pt-2">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#8fc1b2]">
              Kontakt
            </p>
            <h2 className="relative mt-4 max-w-2xl text-3xl font-black leading-tight text-[#07463f] sm:text-5xl">
              Napisz lub zadzwoń do nas.
              <br />
              <span className="font-serif italic text-[#07463f]">Porozmawiajmy o nauce.</span>
              <span className="absolute -bottom-2 left-0 h-2 w-44 rounded-full bg-[#f6c65f]" />
              <DecorativeArrow className="absolute -right-12 top-8 hidden h-12 w-16 rotate-[-22deg] text-[#b7d5c8] sm:block" />
            </h2>
            <p className="mt-9 max-w-xl text-base font-medium leading-8 text-slate-600">
              Chętnie odpowiemy na Twoje pytania dotyczące wyboru korepetytora,
              wolnych terminów czy planu nauczania.
            </p>

            <div className="mt-20 grid gap-6 text-center sm:grid-cols-3 lg:max-w-2xl">
              <ContactBenefit
                icon={<ClockIcon className="h-6 w-6" />}
                title="Szybka odpowiedź"
                text="Odpowiadamy w kilka godzin"
              />
              <ContactBenefit
                icon={<ShieldIcon className="h-6 w-6" />}
                title="Bez zobowiązań"
                text="Rozmowa jest całkowicie darmowa"
              />
              <ContactBenefit
                icon={<LockIcon className="h-6 w-6" />}
                title="Twoje dane są bezpieczne"
                text="Nie udostępniamy ich osobom trzecim"
              />
            </div>
          </div>

          <div className="space-y-5">
            <ContactMethod
              icon={<MailIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Email"
              value="support.nastomatma@gmail.com"
              badge="Odpowiadamy w kilka godzin"
              href="#kontakt"
            />
            <ContactMethod
              icon={<PhoneChatIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="Messenger / WhatsApp"
              value="Szybki i bezpośredni kontakt"
              badge="Zwykle odpowiadamy od razu"
              href="#kontakt"
              contactMode="messenger"
            />

            <div className="rounded-xl bg-[#eef5ee] px-5 py-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)] sm:px-6">
              <div className="grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dcebe2] text-[#007566]">
                  <ChatBubblesIcon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-base font-black text-[#07463f]">Masz inne pytanie?</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    Napisz do nas - doradzimy najlepsze rozwiązanie.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#007566] px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.18)] transition hover:bg-[#005d51]"
                >
                  Napisz do nas
                  <ArrowRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactModal({ mode = 'email', onClose }) {
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
      aria-labelledby="contact-modal-title"
      onMouseDown={onClose}
    >
      <div
        className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)] lg:grid-cols-[1.08fr_0.92fr]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition hover:bg-[#eff8f5] hover:text-[#007566]"
          aria-label="Zamknij panel kontaktowy"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="relative hidden min-h-[32rem] lg:block">
          <img src={contactImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
        </div>

        <div className="flex flex-col px-6 py-7 sm:px-10 sm:py-9">
          <div className="mx-auto w-full max-w-[24rem]">
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#e8f1ea] text-[#007566]">
                <ChatBubblesIcon className="h-7 w-7" />
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
              <h2 id="contact-modal-title" className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                Skontaktuj się
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {isMessengerMode
                  ? 'Napisz do nas bezpośrednio na Messengerze albo zaloguj się, żeby zobaczyć numer.'
                  : 'Opisz krótko, z czym możemy pomóc.'}
              </p>
            </div>

            {isMessengerMode ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-400">
                    Numer telefonu
                  </label>
                  <div className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <span className="flex items-center gap-3 text-sm font-extrabold text-[#07463f]">
                      <PhoneChatIcon className="h-5 w-5 shrink-0 text-[#007566]" />
                      <span className="select-none blur-[3px]">+48 000 000 000</span>
                    </span>
                    <span className="rounded-full bg-[#e8f1ea] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#007566]">
                      ukryty
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    openRegisterModal();
                    onClose();
                  }}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md border-2 border-[#007566] bg-white px-5 py-3 text-center text-sm font-extrabold text-[#07463f] transition hover:bg-[#eff8f5]"
                >
                  Zaloguj się lub zarejestruj, żeby zobaczyć numer
                </button>

                <a
                  href={MESSENGER_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#007566] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.2)] transition hover:bg-[#005d51]"
                >
                  Przejdź do czatu Messenger
                  <ArrowRightIcon className="h-5 w-5" />
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
                    <MailIcon className="h-5 w-5 shrink-0 text-[#007566]" />
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
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md bg-[#007566] px-5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(0,117,102,0.2)] transition hover:bg-[#005d51]"
                >
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                  <PaperPlaneIcon className="h-5 w-5" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid gap-4 border-t border-zinc-200 bg-[#fcfaf7] px-6 py-4 sm:grid-cols-3 sm:px-10 lg:col-span-2">
          <ContactModalBenefit icon={<ClockIcon className="h-5 w-5" />} title="Szybka odpowiedź" text="Odpowiadamy w kilka godzin" />
          <ContactModalBenefit icon={<ShieldIcon className="h-5 w-5" />} title="Bez zobowiązań" text="Rozmowa jest darmowa" />
          <ContactModalBenefit icon={<CheckCircleIcon className="h-5 w-5" />} title="Dobór planu" text="Pomożemy wybrać poziom" />
        </div>
      </div>
    </div>
  );
}

function ContactModalBenefit({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f1ea] text-[#007566]">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-black text-slate-950">{title}</span>
        <span className="mt-0.5 block text-xs font-semibold text-slate-500">{text}</span>
      </span>
    </div>
  );
}

function ContactBenefit({ icon, title, text }) {
  return (
    <article>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f1ea] text-[#007566]">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-black text-[#07463f]">{title}</h3>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{text}</p>
    </article>
  );
}

function ContactMethod({ icon, title, value, badge, href, contactMode = 'email' }) {
  const handleClick = (event) => {
    if (href === '#kontakt') {
      event.preventDefault();
      openContactModal(contactMode);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="group flex flex-col gap-4 rounded-xl border border-zinc-100 bg-white px-4 py-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)] transition hover:border-[#b7d5c8] hover:shadow-[0_18px_38px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-6"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e8f1ea] text-[#007566] sm:h-16 sm:w-16">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-[#07463f] sm:text-base">{title}</span>
        <span className="mt-1 block text-sm font-medium leading-5 text-slate-600">
          {value}
        </span>
        <span className="mt-1 block text-sm font-medium leading-5 text-slate-400">
          {badge}
        </span>
      </span>
      <ArrowRightIcon className="hidden h-6 w-6 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#007566] sm:block" />
    </a>
  );
}
