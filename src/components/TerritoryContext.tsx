'use client';
import { useTranslations } from 'next-intl';
import { SITE } from '@/data/config';
import { MapPin, Mountain, Users, Database } from 'lucide-react';

export default function TerritoryContext() {
  const t = useTranslations('home');
  return (
    <section className="section">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="heading-2 mb-4">{t('context_title')}</h2>
          <p className="body-lg mb-3">{t('context_p1')}</p>
          <p className="body-lg mb-3">{t('context_p2')}</p>
          <p className="body-lg">{t('context_p3')}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card flex flex-col gap-1">
            <MapPin className="w-5 h-5 text-andean-water" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('context_stat_area')}</span>
            <span className="text-2xl font-extrabold text-andean-deep">{SITE.area_km2.toLocaleString('en')} km²</span>
          </div>
          <div className="card flex flex-col gap-1">
            <Mountain className="w-5 h-5 text-andean-paramo" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('context_stat_alt')}</span>
            <span className="text-2xl font-extrabold text-andean-deep">
              {SITE.elevation_min_m.toLocaleString('en')}–{SITE.elevation_max_m.toLocaleString('en')} m
            </span>
          </div>
          <div className="card flex flex-col gap-1">
            <Users className="w-5 h-5 text-andean-earth" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('context_stat_pop')}</span>
            <span className="text-2xl font-extrabold text-andean-deep">{SITE.population_2022.toLocaleString('en')}</span>
          </div>
          <div className="card flex flex-col gap-1">
            <Database className="w-5 h-5 text-andean-deep" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('context_stat_stations')}</span>
            <span className="text-2xl font-extrabold text-andean-deep">21 INAMHI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
