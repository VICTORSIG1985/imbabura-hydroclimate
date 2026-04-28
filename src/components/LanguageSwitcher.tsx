'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() ?? '/';

  const switchTo = (target: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return `/${target}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return '/' + segments.join('/');
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
      {locales.map(loc => (
        <Link
          key={loc}
          href={switchTo(loc)}
          className={`px-2 py-1 rounded transition-colors ${
            currentLocale === loc
              ? 'bg-andean-deep text-white font-bold'
              : 'text-slate-600 hover:bg-andean-snow'
          }`}
        >
          {loc.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
