import { useState } from 'react';
import individualLearningImage from '../assets/individual-learning.png';

const tutors = [
  {
    name: 'Kuba',
    initial: 'K',
    field: 'Inżynieria energetyki',
    school: '(Politechnika)',
    color: 'bg-orange-700',
    tags: ['Matematyka szkoła', 'Matura Rozszerzona', 'Fizyka', 'Analiza matematyczna'],
  },
  {
    name: 'Hubert',
    initial: 'H',
    field: 'Budownictwo',
    school: '(Politechnika)',
    color: 'bg-orange-600',
    tags: ['Matematyka szkoła', 'Matura Podstawowa', 'Mechanika', 'Geometria'],
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
  return (
    <>
      <div className="relative overflow-hidden bg-[#fcfaf7]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(159,95,44,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(159,95,44,0.045)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -left-24 top-64 h-80 w-80 rounded-full bg-orange-50/80 blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/35" />

        <section className="relative">
          <div className="absolute left-6 top-48 hidden grid-cols-3 gap-6 md:grid">
            {Array.from({ length: 15 }).map((_, index) => (
              <span key={index} className="h-2 w-2 rounded-full bg-slate-300" />
            ))}
          </div>

          <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-7xl items-center gap-12 px-6 py-14 sm:py-16 lg:px-10 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-8 inline-flex max-w-full flex-wrap items-center gap-3 rounded-full border border-orange-300 bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-orange-600 shadow-[0_10px_28px_rgba(159,95,44,0.12)] sm:mb-10 sm:gap-4 sm:px-5 sm:text-sm">
                <GraduationCapIcon className="h-5 w-5" />
                <span>Klasa 1 SP</span>
                <span>•</span>
                <span>Matura</span>
                <span>•</span>
                <span>5 lat doświadczenia</span>
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
                Matematyka,
                <br />
                którą
                <br />
                <span className="relative inline-block text-orange-600">
                  rozumiesz
                  <span className="absolute -bottom-2 left-2 h-3 w-[92%] rounded-full border-b-4 border-orange-300" />
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-500 sm:mt-10 sm:text-xl sm:leading-9">
                Uczymy matematyki na poziomie od 1. klasy szkoły podstawowej do
                klas maturalnych (podstawa i rozszerzenie). Mamy ponad 5 lat
                doświadczenia i już ponad 40 zadowolonych uczniów pod naszą
                opieką. Zero zakuwania na pamięć, kładziemy nacisk
                wyłącznie na logiczne myślenie.
              </p>

              <div className="mt-10 flex flex-col gap-5 sm:flex-row">
                <a
                  href="#kontakt"
                  className="inline-flex items-center justify-center gap-4 rounded-md bg-orange-600 px-7 py-4 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.24)] transition hover:bg-orange-700 sm:gap-5 sm:px-9 sm:py-5 sm:text-lg"
                >
                  Zacznij teraz
                  <ArrowRightIcon className="h-6 w-6" />
                </a>
                <a
                  href="#jak-to-dziala"
                  className="inline-flex items-center justify-center gap-4 rounded-md border-2 border-slate-500 bg-white px-7 py-4 text-base font-extrabold text-slate-800 transition hover:border-slate-900 hover:text-slate-950 sm:gap-5 sm:px-9 sm:py-5 sm:text-lg"
                >
                  Jak to działa?
                  <ArrowRightIcon className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-xl flex-col gap-8 xl:flex xl:pl-8">
              <div className="absolute left-[-76px] top-32 hidden h-[360px] w-[220px] rounded-[50%] border border-slate-200 xl:block" />
              {tutors.map((tutor) => (
                <TutorCard key={tutor.name} tutor={tutor} />
              ))}
            </div>
          </div>
        </section>

        <StatsBar />
      </div>
      <HowToStart />
      <WhyUs />
      <PriceList />
      <Corepetitors />
      <Contact />
    </>
  );
}

function TutorCard({ tutor }) {
  return (
    <article className="relative z-10 rounded-2xl bg-white px-8 py-8 shadow-[0_18px_42px_rgba(15,23,42,0.12)] sm:px-10">
      <div className="grid gap-6 sm:grid-cols-[96px_1fr]">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full ${tutor.color} text-5xl font-bold text-white`}>
          {tutor.initial}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-950">{tutor.name}</h2>
          <p className="mt-2 text-base font-extrabold uppercase tracking-widest text-orange-600">
            {tutor.field}
            <br />
            {tutor.school}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {tutor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-bold text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
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
    <section id="jak-to-dziala" className="bg-orange-50 px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-orange-600">
          Proces
        </p>
        <h2 className="mt-5 text-5xl font-black leading-tight text-slate-950 sm:text-7xl">
          Jak działamy
        </h2>
        <p className="mt-6 max-w-2xl text-xl font-medium leading-9 text-slate-500">
          Prosty i skuteczny proces od pierwszego zgłoszenia do pełnego
          opanowania materiału.
        </p>

        <div className="relative mt-16 grid gap-8 lg:grid-cols-4">
          <div className="absolute left-[11%] right-[11%] top-7 hidden border-t-2 border-dashed border-orange-200 lg:block" />
          {steps.map((step) => (
            <ProcessStep key={step.number} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ step }) {
  return (
    <article className="relative text-center">
      <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-xl font-black text-white shadow-[0_12px_26px_rgba(159,95,44,0.26)]">
        {step.number}
      </div>
      <div className="relative mt-8 min-h-[300px] rounded-xl border border-orange-100 bg-white/78 px-7 pb-9 pt-10 shadow-[0_18px_38px_rgba(39,40,45,0.06)]">
        <span className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l border-t border-orange-100 bg-white/78" />
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <StepIcon type={step.icon} />
        </div>
        <h3 className="mt-8 text-2xl font-extrabold text-slate-950">{step.title}</h3>
        <span className="mx-auto mt-5 block h-1 w-12 rounded-full bg-orange-600" />
        <p className="mx-auto mt-6 max-w-xs text-base font-medium leading-7 text-slate-500">
          {step.text}
        </p>
      </div>
    </article>
  );
}

function StepIcon({ type }) {
  if (type === 'chat') {
    return <ChatBubblesIcon className="h-14 w-14" />;
  }

  if (type === 'tutor') {
    return <TutorCheckIcon className="h-14 w-14" />;
  }

  if (type === 'calendar') {
    return <CalendarCheckIcon className="h-14 w-14" />;
  }

  return <ProgressScreenIcon className="h-14 w-14" />;
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
    <section id="dlaczego-my" className="bg-orange-50 pb-20 pt-12">
      <div className="overflow-hidden bg-orange-50">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[0.92fr_1.08fr]">
          <div className="px-6 py-12 sm:px-10 lg:px-14">
            <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-600">
              Badania i analizy
            </p>
            <h2 className="mt-6 max-w-xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Dlaczego nauka indywidualna <span className="text-orange-600">działa?</span>
            </h2>
            <span className="mt-6 block h-1 w-12 rounded-full bg-orange-600" />
            <p className="mt-7 max-w-lg text-base font-medium leading-8 text-slate-600">
              W klasie liczącej 25-30 uczniów nauczyciel musi podzielić uwagę między wszystkich. Sprawdź, ile czasu realnie przypada na jedno dziecko podczas lekcji.
            </p>
            <div className="mt-8 flex max-w-md items-center gap-4 rounded-full bg-orange-50 px-5 py-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-orange-600">
                <UsersIcon className="h-7 w-7" />
              </span>
              <p className="text-sm font-bold leading-6 text-slate-700">
                Indywidualne podejście to większe zrozumienie, szybsze postępy i pewność siebie.
              </p>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden">
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

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div id="symulator-uwagi" className="relative z-10 -mt-10 rounded-2xl border border-orange-100 bg-white px-6 py-8 shadow-[0_18px_42px_rgba(39,40,45,0.08)] sm:px-10 lg:px-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
              <StopwatchIcon className="h-9 w-9" />
            </span>
            <div>
              <h3 className="text-2xl font-black text-slate-950 sm:text-3xl">
                Sprawdź ile czasu nauczyciel ma dla Twojego dziecka
              </h3>
              <p className="mt-3 max-w-3xl text-base font-medium leading-7 text-slate-500">
                Użyj suwaka, aby wybrać wielkość klasy szkolnej. Zobacz, ile minut z 45-minutowej lekcji przypada statystycznie na jedno dziecko.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-5 flex flex-col justify-between gap-3 text-base font-black text-slate-950 sm:flex-row sm:items-center">
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

            <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
              <TimeComparisonCard
                eyebrow="Lekcja w szkole publicznej"
                value={`${wholeMinutes} min ${seconds.toString().padStart(2, '0')} sek`}
                text={`Twoje dziecko ma lekcji w ${classSize}-osobowej klasie.`}
              />
              <div className="flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-black uppercase text-slate-700">
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
            <article key={benefit.title} className="border-b border-orange-100 px-7 py-12 text-center last:border-b-0 sm:border-r lg:border-b-0 lg:py-14">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                {benefit.icon}
              </span>
              <h3 className="mt-7 text-base font-black text-slate-950">{benefit.title}</h3>
              <p className="mt-5 text-sm font-medium leading-6 text-slate-500">{benefit.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-9 rounded-2xl border border-orange-100 bg-white px-7 py-7 shadow-[0_16px_34px_rgba(39,40,45,0.06)] sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <TrophyIcon className="h-8 w-8" />
              </span>
              <p className="text-xl font-bold text-slate-700">
                <span className="text-3xl font-black text-orange-600">98%</span> uczniów osiąga lepsze wyniki dzięki korepetycjom indywidualnym 1:1.
              </p>
            </div>
            <a
              href="#kontakt"
              className="inline-flex w-full items-center justify-center gap-4 rounded-md bg-orange-600 px-8 py-5 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700 sm:w-auto"
            >
              Umów lekcję próbną
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeComparisonCard({ eyebrow, value, text, highlighted = false }) {
  return (
    <article className={`rounded-lg border px-7 py-7 ${highlighted ? 'border-orange-200 bg-orange-50/40' : 'border-zinc-200 bg-white'}`}>
      <p className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.28em] text-orange-600">
        {highlighted ? <GraduationCapIcon className="h-5 w-5" /> : <SchoolIcon className="h-5 w-5" />}
        {eyebrow}
      </p>
      <p className={`mt-5 text-4xl font-black leading-none sm:text-5xl ${highlighted ? 'text-orange-600' : 'text-slate-950'}`}>
        {value}
      </p>
      <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-500">
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
  const [selectedGrade, setSelectedGrade] = useState('Dopuszczający (2)');
  const [selectedGoal, setSelectedGoal] = useState('Bieżąca pomoc / spokój przy lekcjach');
  const recommendation = recommendationMap[selectedGrade];

  return (
    <section id="cennik" className="relative overflow-hidden bg-[#fcfaf7] px-6 py-20 lg:px-10">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(159,95,44,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(159,95,44,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-orange-50/80 blur-3xl" />
      <div className="relative mx-auto max-w-7xl rounded-2xl border-2 border-orange-600/45 px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
        <div className="relative overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.45em] text-orange-600">
              Cennik Pakiety
            </p>
            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Elastyczne Pakiety Lekcyjne
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-500">
              Im więcej lekcji w tygodniu, tym niższa stawka za każdą godzinę.
              Bez długoterminowych umów - płacisz miesięcznie i rezygnujesz kiedy chcesz.
            </p>

            <div className="mt-7 inline-flex max-w-full items-start gap-3 rounded-md bg-orange-50 px-5 py-3 text-sm font-semibold leading-6 text-slate-400 sm:items-center">
              <InfoIcon className="h-5 w-5 shrink-0 text-orange-500" />
              <span>Wszystkie ceny podane są w przeliczeniu na 60-minutowe zajęcia indywidualne.</span>
            </div>

            <div className="mt-12 grid gap-8 xl:grid-cols-3">
              {packages.map((item) => (
                <PricingCard key={item.name} item={item} />
              ))}
            </div>

          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-white px-6 py-10 shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:px-12">
          <h3 className="flex flex-col gap-4 text-lg font-black uppercase tracking-[0.14em] text-slate-950 sm:flex-row sm:items-center sm:gap-5 sm:text-xl sm:tracking-[0.18em]">
            <ClockIcon className="h-9 w-9 text-orange-600" />
            Kalkulacja stawek godzinowych
          </h3>
          <div className="mt-10 space-y-8">
            {packages.map((item, index) => (
              <RateRow key={item.name} item={item} index={index} />
            ))}
          </div>
          <div className="mt-10 border-t border-zinc-200 pt-7">
            <p className="flex gap-4 text-base font-medium leading-7 text-slate-400">
              <InfoIcon className="mt-1 h-6 w-6 shrink-0 text-orange-500" />
              <span>
                Średnia rynkowa cena indywidualnych korepetycji na poziomie szkoły
                średniej w aglomeracjach wynosi 110-160 zł/h. Nasze pakiety optymalizują Twój budżet.
              </span>
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl bg-slate-950 px-8 py-10 text-white shadow-[0_18px_42px_rgba(15,23,42,0.16)] lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1px_1fr] lg:items-center">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <TargetIcon className="h-14 w-14 text-orange-600" />
                <h3 className="text-3xl font-black leading-tight">
                  Dobierz idealny pakiet
                  <br />
                  dla dziecka
                </h3>
              </div>
              <p className="mt-7 max-w-md text-lg font-medium leading-8 text-slate-300">
                Wybierz aktualną sytuację edukacyjną i cel, a nasz algorytm dobierze plan.
              </p>

              <div className="mt-8 space-y-6">
                <label className="block">
                  <span className="mb-3 block text-base font-bold text-slate-300">
                    Aktualne oceny dziecka:
                  </span>
                  <select
                    value={selectedGrade}
                    onChange={(event) => setSelectedGrade(event.target.value)}
                    className="w-full rounded-md bg-white px-5 py-4 text-base font-semibold text-slate-700 outline-none"
                  >
                    {Object.keys(recommendationMap).map((grade) => (
                      <option key={grade}>{grade}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-3 block text-base font-bold text-slate-300">
                    Twój cel nauczania:
                  </span>
                  <select
                    value={selectedGoal}
                    onChange={(event) => setSelectedGoal(event.target.value)}
                    className="w-full rounded-md bg-white px-5 py-4 text-base font-semibold text-slate-700 outline-none"
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

            <article className="rounded-xl border border-slate-700 bg-white/5 px-8 py-8">
              <span className="inline-flex items-center gap-2 rounded bg-orange-600 px-4 py-2 text-sm font-black uppercase tracking-wide">
                <StarIcon className="h-4 w-4" />
                Rekomendacja
              </span>
              <p className="mt-7 text-base font-semibold text-slate-300">
                Najlepszy wybór dla Ciebie
              </p>
              <h3 className="mt-4 text-4xl font-black text-orange-600">
                {recommendation.title}
              </h3>
              <p className="mt-6 max-w-md text-lg font-medium leading-8 text-slate-300">
                {recommendation.description}
              </p>
              <div className="mt-8 border-t border-slate-700 pt-7">
                <p className="text-base font-semibold text-slate-400">
                  Sugerowany korepetytor:
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-xl font-black">
                    {recommendation.tutor[0]}
                  </span>
                  <div>
                    <p className="text-lg font-black">{recommendation.tutor}</p>
                    <p className="text-base font-medium text-slate-300">{recommendation.subject}</p>
                  </div>
                </div>
              </div>
              <a
                href="#kontakt"
                className="mt-8 inline-flex w-full items-center justify-center gap-5 rounded-md bg-orange-600 px-8 py-5 text-lg font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700"
              >
                Wybieram ten pakiet
                <ArrowRightIcon className="h-6 w-6" />
              </a>
              <p className="sr-only">Wybrany cel nauczania: {selectedGoal}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ item }) {
  const isPopular = item.popular;

  return (
    <article
      className={`relative flex h-full flex-col rounded-xl border px-6 py-10 shadow-[0_14px_32px_rgba(15,23,42,0.08)] sm:px-8 ${
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
      <p className={`text-sm font-black uppercase tracking-[0.2em] ${isPopular ? 'text-orange-500' : 'text-slate-700'}`}>
        {item.name}
      </p>
      <div className="mt-5 flex items-end gap-3">
        <span className="text-7xl font-black leading-none">{item.price}</span>
        <span className="mb-3 text-2xl font-black">zł</span>
      </div>
      <p className={`mt-3 text-base font-bold ${isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
        za godzinę ・ {item.frequency}
      </p>
      <p className={`mt-7 border-b pb-6 text-base font-bold ${isPopular ? 'border-slate-700 text-slate-400' : 'border-zinc-200 text-slate-400'}`}>
        {item.monthly}
      </p>
      <ul className="mt-7 flex-1 space-y-5">
        {item.features.map((feature) => (
          <li key={feature} className={`flex gap-3 text-base font-bold leading-6 ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
            <CheckCircleIcon className="mt-0.5 h-6 w-6 shrink-0 text-orange-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="#kontakt"
        className={`mt-10 inline-flex w-full items-center justify-center gap-4 rounded-md px-5 py-4 text-sm font-black transition sm:gap-5 sm:px-6 sm:text-base ${
          isPopular
            ? 'bg-orange-600 text-white hover:bg-orange-700'
            : 'border-2 border-slate-700 text-slate-950 hover:border-slate-950'
        }`}
      >
        {item.button}
        <ArrowRightIcon className="h-5 w-5" />
      </a>
    </article>
  );
}

function RateRow({ item, index }) {
  const widths = ['88%', '82%', '72%'];
  const colors = ['bg-slate-950', 'bg-orange-600', 'bg-emerald-600'];
  const textColors = ['text-slate-950', 'text-orange-600', 'text-emerald-600'];

  return (
    <div className="grid gap-4 xl:grid-cols-[90px_110px_1fr_90px] xl:items-center">
      <p className="text-xl font-black text-slate-950">{item.name}</p>
      <p className="text-lg font-semibold text-slate-400">{index + 1}h tydzień</p>
      <div className="h-4 overflow-hidden rounded-full bg-zinc-100">
        <div className={`h-full rounded-full ${colors[index]}`} style={{ width: widths[index] }} />
      </div>
      <p className={`text-left text-xl font-black xl:text-right ${textColors[index]}`}>{item.price} zł/h</p>
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
  return (
    <section id="korepetytorzy" className="bg-orange-50">
      <div className="relative overflow-hidden bg-[#fcfaf7] px-6 py-20 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(159,95,44,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(159,95,44,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="absolute -right-28 top-14 h-80 w-80 rounded-full bg-orange-50/80 blur-3xl" />
        <div className="relative mx-auto max-w-7xl rounded-2xl border-2 border-orange-600/45 px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-orange-600">
            Korepetytorzy
          </p>
          <h2 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Poznaj swoich <span className="text-orange-600">korepetytorów</span>
          </h2>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-9 text-slate-500">
            Kuba i Hubert to studenci Politechniki, którzy tłumaczą matematykę
            prostym językiem - od podstawówki po maturę.
          </p>

          <div className="mt-12 grid gap-8 xl:grid-cols-2">
            {tutorProfiles.map((profile) => (
              <TutorProfileCard key={profile.name} profile={profile} />
            ))}
          </div>
        </div>
      </div>

      <ProgramSection />
    </section>
  );
}

function TutorProfileCard({ profile }) {
  const isOrange = profile.theme === 'orange';
  const details = isOrange
    ? {
        levels: '1-8 klasa,\nliceum, matura',
        specialization: 'Matura podstawowa,\ngeometria, statyka',
        style: 'Spokój,\ncierpliwość i\nkrok po kroku',
        bullets: [
          'Pomaga zrozumieć podstawy i uporządkować wiedzę.',
          'Tłumaczy cierpliwie, krok po kroku, aż wszystko stanie się jasne.',
          'Wspiera uczniów, którzy potrzebują pewności siebie w matematyce.',
        ],
        button: 'Wybierz Huberta',
      }
    : {
        levels: '7-8 klasa,\nliceum, matura',
        specialization: 'Matura rozszerzona,\nfizyka, analiza',
        style: 'Logiczne\nmyślenie i\npraktyka',
        bullets: [
          'Tłumaczy trudne zagadnienia na proste przykłady.',
          'Łączy matematykę z fizyką i pokazuje, jak to działa w praktyce.',
          'Pomaga przełamać bariery mentalne i zrozumieć "dlaczego".',
        ],
        button: 'Wybierz Kubę',
      };

  return (
    <article className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white px-6 py-7 shadow-[0_18px_42px_rgba(39,40,45,0.06)] sm:px-8 sm:py-8">
      <div className="absolute right-7 top-7 hidden grid-cols-5 gap-3 sm:grid">
        {Array.from({ length: 25 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-orange-100" />
        ))}
      </div>

      <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center">
        <span className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-orange-50 text-6xl font-black text-orange-600 shadow-inner">
            {profile.initial}
          </span>
        <div>
          <h3 className="text-4xl font-black text-slate-950">{profile.name}</h3>
          <p className="mt-4 flex flex-wrap items-center gap-3 text-lg font-black text-slate-800">
            {isOrange ? <SchoolIcon className="h-6 w-6 text-orange-600" /> : <BoltIcon className="h-6 w-6 text-orange-600" />}
              {profile.field}
            </p>
          <p className="mt-3 text-lg font-semibold text-slate-500">{profile.year}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-orange-100 pt-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <TutorDetail icon={<GraduationCapIcon className="h-8 w-8" />} label="Poziomy" value={details.levels} />
          <TutorDetail icon={<TargetIcon className="h-8 w-8" />} label="Specjalizacja" value={details.specialization} />
          <TutorDetail icon={<UsersIcon className="h-8 w-8" />} label="Styl" value={details.style} />
        </div>
      </div>

      <ul className="mt-7 space-y-4">
        {details.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-base font-semibold leading-7 text-slate-600">
            <CheckCircleIcon className="mt-0.5 h-6 w-6 shrink-0 text-orange-600" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-4">
        {profile.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-3 rounded-md bg-orange-50 px-4 py-3 text-sm font-black text-slate-600"
          >
            <TagMarkIcon className="h-5 w-5 text-orange-600" />
            {tag}
          </span>
        ))}
      </div>

      <a
        href="#kontakt"
        className="mt-9 inline-flex w-full items-center justify-center gap-5 rounded-md bg-orange-600 px-8 py-5 text-lg font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700"
      >
        {details.button}
        <ArrowRightIcon className="h-6 w-6" />
      </a>
    </article>
  );
}

function TutorDetail({ icon, label, value }) {
  return (
    <div className="grid grid-cols-[56px_1fr] gap-4 border-orange-100 sm:border-r sm:pr-4 last:border-r-0">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
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
  const [activeProgramIndex, setActiveProgramIndex] = useState(0);
  const visibleLevels = educationLevels.slice(activeProgramIndex, activeProgramIndex + 2);
  const maxProgramIndex = educationLevels.length - 2;

  const goToPreviousProgram = () => {
    setActiveProgramIndex((index) => Math.max(0, index - 1));
  };

  const goToNextProgram = () => {
    setActiveProgramIndex((index) => Math.min(maxProgramIndex, index + 1));
  };

  return (
    <section className="relative overflow-hidden bg-[#fcfaf7]">
      <div className="relative z-10 overflow-visible bg-slate-950 px-6 pb-36 pt-24 text-white lg:px-10 lg:pt-28">
        <div className="absolute left-0 top-14 hidden grid-cols-4 gap-4 opacity-25 md:grid">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-orange-200" />
          ))}
        </div>
        <div className="absolute -right-28 top-28 h-96 w-96 rounded-full border border-orange-600/20" />
        <div className="absolute right-8 top-44 hidden grid-cols-3 gap-4 opacity-25 md:grid">
          {Array.from({ length: 15 }).map((_, index) => (
            <span key={index} className="h-1.5 w-1.5 rounded-full bg-orange-200" />
          ))}
        </div>
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[-1px] z-0 h-24 w-full text-[#fcfaf7] sm:h-32 lg:h-36"
        >
          <path
            fill="currentColor"
            d="M0 58c112 25 235 41 360 34 154-8 247-57 389-54 141 3 231 58 386 61 109 2 208-20 305-48v109H0V58Z"
          />
        </svg>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Uczymy od 1. klasy{' '}
              <br />
              <span className="text-orange-600">do Matury</span>
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-300">
              Dostosowujemy program nauczania do podstawy programowej CKE na każdym
              etapie edukacji. Przesuwaj okienka, aby zobaczyć kolejne poziomy.
            </p>
          </div>

          <div className="flex items-center gap-4 lg:mt-2">
            <button
              type="button"
              onClick={goToPreviousProgram}
              disabled={activeProgramIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:border-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Poprzednie poziomy nauczania"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNextProgram}
              disabled={activeProgramIndex === maxProgramIndex}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow-[0_14px_28px_rgba(159,95,44,0.28)] transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Następne poziomy nauczania"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-10 flex justify-center gap-3">
          {Array.from({ length: maxProgramIndex + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveProgramIndex(index)}
              className={`h-2 rounded-full transition ${
                index === activeProgramIndex ? 'w-8 bg-orange-600' : 'w-2 bg-white/70'
              }`}
              aria-label={`Pokaż poziomy od ${index + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto -mb-56 mt-14 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {visibleLevels.map((level) => (
              <EducationCard key={level.title} level={level} />
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-0 h-72 bg-[#fcfaf7]" />
    </section>
  );
}

function EducationCard({ level }) {
  return (
    <article
      className={`relative flex h-full min-h-[430px] flex-col rounded-xl border bg-white px-6 py-8 text-center shadow-[0_18px_42px_rgba(39,40,45,0.12)] sm:px-8 sm:py-9 ${
        level.active
          ? 'border-orange-100 shadow-[0_18px_42px_rgba(39,40,45,0.07)]'
          : 'border-orange-100'
      }`}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600">
        <LevelIcon type={level.icon} />
      </div>
      <h3 className="mt-6 text-xl font-black text-slate-950">{level.title}</h3>
      <p className="mx-auto mt-3 inline-flex rounded-md bg-orange-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-orange-600">
        {level.subtitle}
      </p>
      <p className="mx-auto mt-6 min-h-[56px] max-w-xs text-sm font-semibold leading-6 text-slate-500">
        {level.description}
      </p>
      <div className="mt-6 flex-1 border-t border-orange-100 pt-6 text-left">
        <ul className="space-y-4 text-sm font-bold leading-6 text-slate-600">
          {level.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
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
    return <RulerIcon className="h-11 w-11" />;
  }

  if (type === 'bars') {
    return <BarsIcon className="h-11 w-11" />;
  }

  if (type === 'line') {
    return <ChartIcon className="h-11 w-11" />;
  }

  if (type === 'cap') {
    return <GraduationCapIcon className="h-11 w-11" />;
  }

  return <SproutIcon className="h-11 w-11" />;
}
function Contact(){
  return (
    <section id="kontakt" className="bg-[#fffdfb] px-6 pb-20 pt-10 text-slate-950 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.45em] text-orange-600">
              Kontakt
            </p>
            <h2 className="mt-6 max-w-xl text-3xl font-black leading-tight sm:text-4xl">
              Napisz lub zadzwoń do nas.
              <br />
              <span className="text-orange-600">Porozmawiajmy o nauce.</span>
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-7 text-slate-600">
              Chętnie odpowiemy na Twoje pytania dotyczące wyboru korepetytora,
              wolnych terminów czy planu nauczania.
            </p>
            <span className="mt-7 block h-0.5 w-14 rounded-full bg-orange-600" />

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
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
              icon={<MailIcon className="h-8 w-8" />}
              title="Email"
              value="nastomatma@gmail.com"
              badge="Odpowiadamy w kilka godzin"
              href="mailto:nastomatma@gmail.com"
            />
            <ContactMethod
              icon={<PhoneChatIcon className="h-8 w-8" />}
              title="Messenger / WhatsApp"
              value="Szybki i bezpośredni kontakt"
              badge="Zwykle odpowiadamy od razu"
              href="#kontakt"
            />
            <ContactMethod
              icon={<LaptopIcon className="h-8 w-8" />}
              title="Zajęcia Online i Hybrydowe"
              value="Profesjonalne tablice wirtualne i notatki PDF po lekcji"
              badge="Wygodnie i efektywnie"
              href="#kontakt"
            />
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-orange-100 bg-white px-6 py-6 shadow-[0_16px_36px_rgba(39,40,45,0.06)] sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ChatBubblesIcon className="h-12 w-12 shrink-0 text-orange-600" />
              <div>
                <h3 className="text-xl font-black">Masz inne pytanie?</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Napisz do nas - doradzimy najlepsze rozwiązanie dla Ciebie.
                </p>
              </div>
            </div>
            <a
              href="mailto:nastomatma@gmail.com"
              className="inline-flex w-full items-center justify-center gap-3 rounded-md bg-orange-600 px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(159,95,44,0.2)] transition hover:bg-orange-700 sm:w-auto"
            >
              Napisz do nas
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactBenefit({ icon, title, text }) {
  return (
    <article className="border-orange-100 sm:border-r sm:pr-5 last:border-r-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-orange-100 bg-white text-orange-600 shadow-[0_10px_24px_rgba(39,40,45,0.04)]">
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-black">{title}</h3>
      <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{text}</p>
    </article>
  );
}

function ContactMethod({ icon, title, value, badge, href }) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-5 rounded-xl border border-orange-100 bg-white px-5 py-5 shadow-[0_14px_32px_rgba(39,40,45,0.05)] transition hover:border-orange-600/60 hover:shadow-[0_18px_38px_rgba(39,40,45,0.08)] sm:flex-row sm:items-center sm:gap-6 sm:px-6"
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-white shadow-[0_14px_30px_rgba(159,95,44,0.22)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-black text-slate-950">{title}</span>
        <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">
          {value}
        </span>
        <span className="mt-3 inline-flex rounded-md bg-orange-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
          {badge}
        </span>
      </span>
      <ArrowRightIcon className="hidden h-6 w-6 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-orange-600 sm:block" />
    </a>
  );
}
