'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { MENU } from '@/data/config';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale } from '@/i18n/config';

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('menu');
  const tSite = useTranslations('site');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (slug: string) => {
    const target = `/${locale}${slug ? '/' + slug : ''}`;
    if (slug === '') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname?.startsWith(target);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="container-page h-full flex items-center gap-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-lg bg-andean-deep grid place-items-center text-white">
            <MapPin className="w-5 h-5" />
          </span>
          <span className="hidden md:block">
            <span className="block text-sm font-bold text-andean-deep leading-tight">
              {tSite('title').split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="block text-xs text-slate-500 leading-tight">
              {tSite('title').split(' ').slice(2).join(' ')}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4 flex-1">
          {MENU.map(({ slug, key }) => (
            <Link
              key={key}
              href={`/${locale}${slug ? '/' + slug : ''}`}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                isActive(slug)
                  ? 'bg-andean-deep text-white font-semibold'
                  : 'text-slate-600 hover:text-andean-deep hover:bg-andean-snow'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-andean-deep"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-1">
          {MENU.map(({ slug, key }) => (
            <Link
              key={key}
              href={`/${locale}${slug ? '/' + slug : ''}`}
              onClick={() => setOpen(false)}
              className={`text-sm px-3 py-2 rounded-lg ${
                isActive(slug)
                  ? 'bg-andean-deep text-white font-semibold'
                  : 'text-slate-700 hover:bg-andean-snow'
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
