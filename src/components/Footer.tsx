import { useTranslations, useLocale } from 'next-intl';
import { SITE } from '@/data/config';

export default function Footer() {
  const t = useTranslations('site');
  const locale = useLocale();
  return (
    <footer className="border-t border-slate-200 bg-andean-snow">
      <div className="container-page py-8 grid sm:grid-cols-3 gap-6 text-sm text-slate-600">
        <div>
          <p className="font-bold text-andean-deep">{SITE.title_es}</p>
          <p className="text-xs mt-1">{SITE.author}</p>
          <p className="text-xs">{SITE.affiliation}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-700">{SITE.journal}</p>
          <p className="text-xs">{SITE.publisher}</p>
          <p className="text-xs mt-1">{t('footer_doi')}: <a href={SITE.zenodoUrl} target="_blank" rel="noopener noreferrer" className="link-cta">{SITE.doi}</a></p>
        </div>
        <div className="sm:text-right">
          <p>ORCID: <a href={`https://orcid.org/${SITE.orcid}`} target="_blank" rel="noopener noreferrer" className="link-cta">{SITE.orcid}</a></p>
          <p>
            {locale === 'es' ? 'Manuscrito IJC' : 'IJC manuscript'}:{' '}
            <a href={SITE.manuscriptUrl} target="_blank" rel="noopener noreferrer" className="link-cta">Zenodo</a>
          </p>
          <p className="text-xs mt-2">
            © {SITE.year} ·{' '}
            <a href={SITE.licenseUrl} target="_blank" rel="noopener noreferrer" className="link-cta">{SITE.license}</a>
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {locale === 'es' ? 'Datos primarios © INAMHI · uso no comercial' : 'Primary data © INAMHI · non-commercial use'}
          </p>
        </div>
      </div>
    </footer>
  );
}
