interface Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string }[];
  variant?: 'default' | 'compact';
}

export default function PageHero({ kicker, title, subtitle, cta, variant = 'default' }: Props) {
  const py = variant === 'compact' ? 'py-10' : 'py-16 sm:py-20';
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-andean-deep via-andean-water to-andean-deep ${py}`}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-andean-paramo blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-andean-snow blur-3xl rounded-full" />
      </div>
      <div className="container-page relative">
        {kicker && (
          <p className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold tracking-wide uppercase text-andean-snow px-3 py-1 mb-4">
            {kicker}
          </p>
        )}
        <h1 className="heading-1 text-white max-w-4xl">{title}</h1>
        {subtitle && (
          <p className="body-lg text-andean-snow/90 mt-4 max-w-3xl">{subtitle}</p>
        )}
        {cta && cta.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {cta.map((c, i) => (
              <a
                key={c.href}
                href={c.href}
                className={i === 0
                  ? 'inline-flex items-center gap-2 bg-white text-andean-deep hover:bg-andean-snow font-semibold px-5 py-2.5 rounded-lg transition-colors'
                  : 'inline-flex items-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-5 py-2.5 rounded-lg transition-colors'
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
