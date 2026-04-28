import { useTranslations } from 'next-intl';
import { SITE } from '@/data/config';

export default function Footer() {
  const t = useTranslations('site');
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
          <p>GitHub: <a href={`https://github.com/${SITE.githubUser}/${SITE.githubRepo}`} target="_blank" rel="noopener noreferrer" className="link-cta">{SITE.githubUser}/{SITE.githubRepo}</a></p>
          <p className="text-xs mt-2">© {SITE.year} · {SITE.license}</p>
        </div>
      </div>
    </footer>
  );
}
