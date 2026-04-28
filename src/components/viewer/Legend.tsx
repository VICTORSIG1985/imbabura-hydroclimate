'use client';
import { useTranslations } from 'next-intl';
import type { ViewerMode } from '@/types';

export default function Legend({ mode }: { mode: ViewerMode }) {
  const t = useTranslations('viewer.legend');
  const tValid = useTranslations('viewer.validation_status');

  const Row = ({ color, label, border = 'solid' }: { color: string; label: string; border?: 'solid' | 'dashed' | 'dotted' }) => (
    <div className="flex items-center gap-2 text-xs">
      <span
        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
        style={{ background: color, boxShadow: border === 'dashed' ? '0 0 0 1.5px #94a3b8 dashed' : undefined }}
      />
      <span className="text-slate-700">{label}</span>
    </div>
  );

  return (
    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur border border-slate-200 rounded-xl p-3 shadow-lg max-w-[260px]">
      <p className="text-xs font-bold uppercase tracking-wide text-andean-deep mb-2">{t('title')}</p>
      <div className="flex flex-col gap-1.5">
        {mode === 'A' && (
          <>
            <Row color="#dc2626" label="B1 — <2000 m" />
            <Row color="#f59e0b" label="B2 — 2000–2800 m" />
            <Row color="#16a34a" label="B3 — >2800 m" />
          </>
        )}
        {mode === 'B' && (
          <>
            <Row color="#dc2626" label={t('increase')} />
            <p className="text-[10px] text-slate-500 italic mt-1">{t('size_proportional')}</p>
            <p className="text-[10px] text-slate-500 italic">↑ {t('arrow_up')}  ↓ {t('arrow_down')}</p>
          </>
        )}
        {mode === 'C' && (
          <>
            <Row color="#16a34a" label={tValid('ACCEPTABLE')} />
            <Row color="#f59e0b" label={tValid('LIMITED')} />
            <Row color="#cbd5e1" label="—" />
          </>
        )}
        {mode === 'D' && (
          <>
            <Row color="#dc2626" label="ρ > 0 (El Niño → ↑)" />
            <Row color="#cbd5e1" label="ρ ≈ 0" />
            <Row color="#1d4ed8" label="ρ < 0 (El Niño → ↓)" />
            <p className="text-[10px] text-slate-500 italic mt-1">{t('size_proportional')}</p>
          </>
        )}
        {mode === 'E' && (
          <>
            <Row color="#dc2626" label="B1 — <2000 m" />
            <Row color="#f59e0b" label="B2 — 2000–2800 m" />
            <Row color="#16a34a" label="B3 — >2800 m" />
          </>
        )}
      </div>
      <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100">{t('color_warning')}</p>
    </div>
  );
}
