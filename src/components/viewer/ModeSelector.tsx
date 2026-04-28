'use client';
import { useTranslations } from 'next-intl';
import { VIEWER_MODES } from '@/data/config';
import type { ViewerMode } from '@/types';

interface Props {
  active: ViewerMode;
  onChange: (m: ViewerMode) => void;
}

export default function ModeSelector({ active, onChange }: Props) {
  const t = useTranslations('viewer.modes');
  return (
    <div className="flex flex-wrap gap-1.5 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm">
      {VIEWER_MODES.map(({ id, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 text-xs sm:text-sm font-semibold rounded-lg px-3 py-2 transition-colors ${
            active === id
              ? 'bg-andean-deep text-white shadow'
              : 'text-slate-600 hover:bg-andean-snow hover:text-andean-deep'
          }`}
          title={t(`${id}.long`)}
        >
          <span className="hidden sm:inline">{icon}</span>
          <span>
            <span className={`inline-block text-[10px] font-mono rounded px-1 mr-1.5 ${active === id ? 'bg-white/20' : 'bg-slate-100'}`}>{id}</span>
            {t(`${id}.label`)}
          </span>
        </button>
      ))}
    </div>
  );
}
