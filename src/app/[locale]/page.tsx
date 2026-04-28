import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
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
  const isEs = locale === 'es';

  return (
    <>
      {/* Hero con foto del volcán Imbabura + lago San Pablo */}
      <section className="relative overflow-hidden">
        <picture className="absolute inset-0">
          <source media="(max-width: 768px)" srcSet={asset('/img/imbabura/hero_volcan_lago_san_pablo_sm.jpg')} />
          <img
            src={asset('/img/imbabura/hero_volcan_lago_san_pablo.jpg')}
            alt="Volcán Imbabura y Lago San Pablo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-br from-andean-deep/85 via-andean-deep/60 to-andean-water/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        <div className="relative container-page py-24 sm:py-32">
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

          {/* Crédito de la imagen */}
          <p className="absolute bottom-3 right-4 text-[10px] text-white/60 italic">
            {isEs ? 'Foto: Volcán Imbabura y Lago San Pablo · ' : 'Photo: Imbabura Volcano and San Pablo Lake · '}
            <a href="https://commons.wikimedia.org/wiki/File:Volc%C3%A1n_Imbabura_y_lago_San_Pablo.jpg" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              David C. S. (2015) · CC BY-SA 4.0
            </a>
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section id="kpis" className="section section-tinted">
        <h2 className="heading-2 mb-1 text-andean-deep">{t('kpis_title')}</h2>
        <p className="text-sm text-slate-600 mb-6">
          {isEs ? '21 estaciones INAMHI · 1981–2070 · auditoría científica con score 90/100' : '21 INAMHI stations · 1981–2070 · scientific audit score 90/100'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KPIBox label={t('kpi_period')}    value={t('kpi_period_value')}   sub={t('kpi_period_sub')}    explainKey="period" />
          <KPIBox label={t('kpi_warming')}   value={t('kpi_warming_value')}  sub={t('kpi_warming_sub')}   accent="red"   explainKey="warming" />
          <KPIBox label={t('kpi_enso')}      value={t('kpi_enso_value')}     sub={t('kpi_enso_sub')}      accent="blue"  explainKey="enso" />
          <KPIBox label={t('kpi_cmip6')}     value={t('kpi_cmip6_value')}    sub={t('kpi_cmip6_sub')}     accent="amber" explainKey="cmip6" />
          <KPIBox label={t('kpi_lapse')}     value={t('kpi_lapse_value')}    sub={t('kpi_lapse_sub')}     accent="green" explainKey="lapse" />
          <KPIBox label={t('kpi_extremes')}  value={t('kpi_extremes_value')} sub={t('kpi_extremes_sub')}  accent="blue"  explainKey="extremes" />
        </div>
      </section>

      {/* What you'll find */}
      <section className="section pt-0 section-andean">
        <h2 className="heading-2 mb-6 text-andean-deep">{t('what_title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🌎', title: t('what_obs_title'),    desc: t('what_obs_desc'),    href: '/visor' },
            { icon: '📈', title: t('what_trends_title'), desc: t('what_trends_desc'), href: '/resultados' },
            { icon: '🌊', title: t('what_enso_title'),   desc: t('what_enso_desc'),   href: '/resultados' },
            { icon: '🔭', title: t('what_cmip6_title'),  desc: t('what_cmip6_desc'),  href: '/resultados' },
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

      {/* Banner de validación científica */}
      <section className="section pt-0">
        <Link href={`/${locale}/validacion`} className="block group">
          <div className="card border-2 border-andean-water bg-gradient-to-br from-blue-50 to-andean-snow flex flex-col sm:flex-row gap-4 items-center hover:shadow-lg transition-shadow">
            <div className="w-20 h-20 rounded-full bg-andean-deep grid place-items-center text-white shrink-0">
              <span className="text-3xl font-bold">90</span>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider font-bold text-andean-water">
                {isEs ? 'Validación científica · Score 90/100' : 'Scientific validation · Score 90/100'}
              </p>
              <h3 className="heading-3 text-andean-deep mt-1 group-hover:text-andean-water transition">
                {isEs ? 'Auditoría metodológica con estándares IPCC AR6, WMO y Pepin et al. 2022' : 'Methodological audit against IPCC AR6, WMO and Pepin et al. 2022 standards'}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {isEs
                  ? 'Veredicto: válido con limitaciones declaradas · 14 verificaciones pasadas · 7 estándares internacionales cumplidos.'
                  : 'Verdict: valid with declared limitations · 14 checks passed · 7 international standards met.'}
              </p>
            </div>
            <span className="text-andean-water font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>
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
