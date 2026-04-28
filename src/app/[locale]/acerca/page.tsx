import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import { SITE } from '@/data/config';
import { Mail, ExternalLink, Github } from 'lucide-react';
import type { Locale } from '@/i18n/config';

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  return (
    <>
      <PageHero title={t('title')} subtitle={t('subtitle')} variant="compact" />
      <section className="section">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('author_title')}</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-andean-deep to-andean-water rounded-full grid place-items-center text-white text-2xl font-bold shrink-0">
                  VP
                </div>
                <div>
                  <p className="font-bold text-andean-deep text-lg">{SITE.author}</p>
                  <p className="text-sm text-slate-600">{t('author_role')}</p>
                  <p className="text-sm text-slate-600">{SITE.affiliation}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs">
                    <a href={`mailto:${SITE.email}`} className="link-cta inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {SITE.email}</a>
                    <a href={`https://orcid.org/${SITE.orcid}`} target="_blank" rel="noopener noreferrer" className="link-cta inline-flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5"/> ORCID {SITE.orcid}</a>
                    <a href={`https://github.com/${SITE.githubUser}`} target="_blank" rel="noopener noreferrer" className="link-cta inline-flex items-center gap-1"><Github className="w-3.5 h-3.5"/> {SITE.githubUser}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('cite_title')}</h2>
              <p className="text-xs font-mono bg-slate-50 border border-slate-200 rounded p-3 leading-relaxed">{t('cite_apa')}</p>
            </div>

            <div className="card">
              <h2 className="heading-3 text-andean-deep mb-3">{t('ack_title')}</h2>
              <p className="body-lg">{t('ack_desc')}</p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card-dark">
              <h3 className="font-bold mb-2">{t('license_title')}</h3>
              <p className="text-sm text-andean-snow/90">{t('license_desc')}</p>
              <span className="pill bg-white text-andean-deep mt-3">{SITE.license}</span>
            </div>
            <div className="card">
              <h3 className="font-bold text-andean-deep mb-2">Manuscrito</h3>
              <p className="text-xs text-slate-600 mb-1"><strong>{SITE.journal}</strong></p>
              <p className="text-xs text-slate-500">{SITE.publisher}</p>
              <p className="text-xs text-slate-500 mt-2">DOI Zenodo: <a href={SITE.zenodoUrl} target="_blank" rel="noopener noreferrer" className="link-cta">{SITE.doi}</a></p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
