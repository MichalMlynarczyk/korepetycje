const socialLinks = [
  {
    label: 'Facebook',
    href: '#facebook',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          fill="currentColor"
          d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.9h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z"
        />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#instagram',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm6.2-1.2h.01"
        />
      </svg>
    ),
  },
  {
    label: 'E-mail',
    href: 'mailto:kontakt@nastomatma.pl',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5"
        />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white shadow-[0_-18px_40px_rgba(15,23,42,0.14)]">
      <div className="mx-auto flex min-h-28 w-full max-w-7xl flex-col items-center justify-between gap-8 px-6 py-8 sm:flex-row lg:px-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <a
            href="/"
            aria-label="NaSTOmatMa strona główna"
            className="shrink-0 text-2xl font-extrabold tracking-tight"
          >
            <span className="text-white">Na</span>
            <span className="text-orange-600">STO</span>
            <span className="text-white">mat</span>
            <span className="text-orange-600">Ma</span>
          </a>

          <span className="hidden h-9 w-px bg-slate-600 sm:block" />

          <p className="text-center text-sm font-semibold text-slate-400 sm:text-left">
            © 2024 NaSTOmatMa. Wszelkie prawa zastrzeżone.
          </p>
        </div>

        <div className="flex items-center gap-8 text-slate-200">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="transition hover:text-orange-500"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
