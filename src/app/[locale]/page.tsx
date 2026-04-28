import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import KPIBox from '@/components/KPIBox';
import TerritoryContext from '@/components/TerritoryContext';
import { asset } from '@/lib/assets';
import type { Locale } from '@/i18n/config';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent locale={locale} />;
}

function HomeContent({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-andean-deep via-andean-water to-andean-paramo"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(10,37,64,0.92), rgba(29,78,216,0.85)), url(${asset('/graphical_abstract.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        <div className="relative container-page py-20 sm:py-28">
          <p className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs font-semibold tracking-wide uppercase text-andean-snow px-3 py-1 mb-5">
            {t('hero_kicker')}
          </p>
          <h1 className="heading-1 text-white max-w-4xl">{t('hero_title')}</h1>
          <p className="body-lg text-andean-snow/90 mt-5 max-w-3xl">{t('hero_subtitle')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${locale}/visor`} className="inline-flex items-center gap-2 bg-white text-andean-deep hover:bg-andean-snow font-semibold px-6 py-3 rounded-lg transition-colors">
              {t('hero_cta_primary')} →
            </Link>
            <a href="#kpis" className="inline-flex items-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-colors">
              {t('hero_cta_secondary')}
            </a>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section id="kpis" className="section">
        <h2 className="heading-2 mb-1 text-andean-deep">{t('kpis_title')}</h2>
        <p className="text-sm text-slate-600 mb-6">International Journal of Climatology · Wiley · DOI 10.5281/zenodo.19821757</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPIBox label={t('kpi_period')}    value={t('kpi_period_value')}   sub={t('kpi_period_sub')} />
          <KPIBox label={t('kpi_warming')}   value={t('kpi_warming_value')}  sub={t('kpi_warming_sub')} accent="red" />
          <KPIBox label={t('kpi_enso')}      value={t('kpi_enso_value')}     sub={t('kpi_enso_sub')} accent="blue" />
          <KPIBox label={t('kpi_cmip6')}     value={t('kpi_cmip6_value')}    sub={t('kpi_cmip6_sub')} accent="amber" />
          <KPIBox label={t('kpi_lapse')}     value={t('kpi_lapse_value')}    sub={t('kpi_lapse_sub')} accent="green" />
          <KPIBox label={t('kpi_extremes')}  value={t('kpi_extremes_value')} sub={t('kpi_extremes_sub')} accent="blue" />
        </div>
      </section>

      {/* What you'll find */}
      <section className="section pt-0">
        <h2 className="heading-2 mb-6 text-andean-deep">{t('what_title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🌎', title: t('what_obs_title'),    desc: t('what_obs_desc'),    href: '/visor#A' },
            { icon: '📈', title: t('what_trends_title'), desc: t('what_trends_desc'), href: '/visor#B' },
            { icon: '🌊', title: t('what_enso_title'),   desc: t('what_enso_desc'),   href: '/visor#D' },
            { icon: '🔭', title: t('what_cmip6_title'),  desc: t('what_cmip6_desc'),  href: '/visor#E' },
          ].map(({ icon, title, desc, href }) => (
            <Link
              key={title}
              href={`/${locale}${href}`}
              className="card hover:border-andean-water hover:bg-andean-snow transition-all group"
            >
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-bold text-andean-deep group-hover:text-andean-water transition-colors mb-1">{title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Imbabura como territorio */}
      <TerritoryContext />

      {/* ¿Por qué importa? */}
      <section className="section pt-0">
        <div className="card-dark">
          <h2 className="heading-3 text-white mb-3">{t('why_title')}</h2>
          <p className="body-lg text-andean-snow/90 mb-2">{t('why_p1')}</p>
          <p className="body-lg text-andean-snow/90">{t('why_p2')}</p>
        </div>
      </section>

      {/* CTA visor */}
      <section className="section pt-0 pb-16">
        <div className="bg-gradient-to-r from-andean-deep to-andean-water rounded-2xl p-8 sm:p-12 text-white text-center">
          <h2 className="heading-2 text-white mb-2">{t('explore_title')}</h2>
          <p className="body-lg text-andean-snow/90 mb-5 max-w-2xl mx-auto">{t('explore_subtitle')}</p>
          <Link href={`/${locale}/visor`} className="inline-flex items-center gap-2 bg-white text-andean-deep hover:bg-andean-snow font-bold px-6 py-3 rounded-lg transition-colors">
            {t('hero_cta_primary')} →
          </Link>
        </div>
      </section>
    </>
  );
}
