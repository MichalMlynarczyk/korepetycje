const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61591144089900&mibextid=wwXIfr&rdid=LMErxcEybUPiCe0v&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F191Mh71ZZi%2F%3Fmibextid%3DwwXIfr#',
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
    href: 'https://www.instagram.com/nastomatma/',
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
    href: '#kontakt',
    opensContactModal: true,
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
  const openContactModal = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('nastomatma:open-contact'));
  };

  return (
    <footer className="border-t border-zinc-100 bg-[#fffdf9] text-[#07463f]">
      <div className="mx-auto flex min-h-28 w-full max-w-[78rem] flex-col items-center justify-between gap-8 px-6 py-8 sm:flex-row lg:px-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <a
            href="/"
            aria-label="NaSTOmatMa strona główna"
            className="shrink-0 text-xl font-extrabold tracking-tight"
          >
            <span className="text-[#07463f]">Na</span>
            <span className="text-[#007566]">STO</span>
            <span className="text-[#07463f]">mat</span>
            <span className="text-[#007566]">Ma</span>
          </a>

          <p className="text-center text-sm font-medium leading-6 text-slate-400 sm:text-left">
            © 2024 NaSTOmatMa.
            <br />
            Wszelkie prawa zastrzeżone.
          </p>
        </div>

        <div className="flex items-center gap-5 text-slate-500">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.opensContactModal ? openContactModal : undefined}
              target={link.opensContactModal ? undefined : '_blank'}
              rel={link.opensContactModal ? undefined : 'noopener noreferrer'}
              aria-label={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-[#e8f1ea] hover:text-[#007566]"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
