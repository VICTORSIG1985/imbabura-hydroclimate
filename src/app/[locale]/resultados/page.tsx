import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { figureUrl } from '@/lib/assets';
import type { Locale } from '@/i18n/config';

export default async function ResultsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('results');

  const sections = [
    { id: 's41', title: t('s41_title'), text: t('s41_p'), figure: 'Figure_02.png' },
    { id: 's42', title: t('s42_title'), text: t('s42_p'), figure: 'Figure_03.png' },
    { id: 's43', title: t('s43_title'), text: t('s43_p'), figure: 'Figure_04.png' },
    { id: 's44', title: t('s44_title'), text: t('s44_p'), figure: 'Figure_05.png' },
    { id: 's45', title: t('s45_title'), text: t('s45_p'), figure: 'Figure_08.png' },
  ];

  return (
    <>
      <PageHero kicker="§4" title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="space-y-12">
          {sections.map((s, i) => (
            <article key={s.id} className="grid lg:grid-cols-2 gap-8 items-start">
              <div className={i % 2 === 0 ? '' : 'lg:order-2'}>
                <h2 className="heading-3 mb-3 text-andean-deep">{s.title}</h2>
                <p className="body-lg">{s.text}</p>
              </div>
              <figure className={i % 2 === 0 ? '' : 'lg:order-1'}>
                <img
                  src={figureUrl('main', s.figure)}
                  alt={s.title}
                  className="w-full rounded-xl border border-slate-200 shadow-sm"
                  loading="lazy"
                />
              </figure>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
