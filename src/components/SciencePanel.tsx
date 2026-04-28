'use client';
import { useTranslations } from 'next-intl';
import { Download, AlertTriangle, Link2 } from 'lucide-react';

export interface PanelEntry {
  keyFinding?: string;
  variable?: string;
  value?: string;
  significance?: string;
  source?: string;
  period?: string;
  interpretation?: string;
  limitation?: string;
  downloadUrl?: string;
  traceabilityHref?: string;
}

export default function SciencePanel({ entry }: { entry: PanelEntry }) {
  const t = useTranslations('viewer.panel');
  const tCommon = useTranslations('common');

  const Row = ({ label, value }: { label: string; value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col py-2 border-b border-slate-100 last:border-0">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="text-sm text-slate-800 mt-0.5">{value}</span>
      </div>
    );
  };

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col h-full overflow-hidden">
      <h3 className="font-bold text-andean-deep text-base mb-2">{t('key_finding')}</h3>
      {entry.keyFinding && (
        <p className="text-sm text-slate-700 italic border-l-4 border-andean-water pl-3 py-1 bg-andean-snow rounded-r mb-3">
          {entry.keyFinding}
        </p>
      )}
      <div className="overflow-y-auto flex-1">
        <Row label={t('variable')} value={entry.variable} />
        <Row label={t('value')} value={entry.value} />
        <Row label={t('significance')} value={entry.significance} />
        <Row label={t('source')} value={entry.source} />
        <Row label={t('period')} value={entry.period} />
        <Row label={t('interpretation')} value={entry.interpretation} />
        {entry.limitation && (
          <div className="flex gap-2 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-900 mb-0.5">{t('limitation')}</p>
              <p className="text-xs text-amber-800">{entry.limitation}</p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
        {entry.downloadUrl && (
          <a
            href={entry.downloadUrl}
            download
            className="btn-primary text-xs justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            {t('download')}
          </a>
        )}
        {entry.traceabilityHref && (
          <a
            href={entry.traceabilityHref}
            className="btn-outline text-xs justify-center"
          >
            <Link2 className="w-3.5 h-3.5" />
            {t('traceability_link')}
          </a>
        )}
      </div>
    </aside>
  );
}
