'use client';
import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { dataUrl } from '@/lib/assets';
import { Search } from 'lucide-react';

interface Row {
  [k: string]: string;
}

export default function TraceabilityTable() {
  const t = useTranslations('traceability');
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch(dataUrl('traceability.json'))
      .then(r => r.json())
      .then(d => setRows(d.rows ?? []));
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const ql = q.toLowerCase();
    return rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(ql)));
  }, [rows, q]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 min-h-[500px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t('search_placeholder')}
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-andean-water"
        />
      </div>
      <p className="text-xs text-slate-500">{filtered.length} / {rows.length} {t('all_traces').toLowerCase()}</p>
      <div className="overflow-auto flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-andean-snow">
            <tr>
              <th className="text-left p-2 font-bold text-andean-deep">{t('col_location')}</th>
              <th className="text-left p-2 font-bold text-andean-deep">{t('col_claim')}</th>
              <th className="text-left p-2 font-bold text-andean-deep font-mono">{t('col_input')}</th>
              <th className="text-left p-2 font-bold text-andean-deep font-mono">{t('col_intermediate')}</th>
              <th className="text-left p-2 font-bold text-andean-deep font-mono">{t('col_script')}</th>
              <th className="text-left p-2 font-bold text-andean-deep font-mono">{t('col_output')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-andean-snow/50">
                <td className="p-2 align-top">{r['Manuscript location']}</td>
                <td className="p-2 align-top">{r['Numerical claim']}</td>
                <td className="p-2 align-top font-mono text-[10px]">{r['Raw input file']}</td>
                <td className="p-2 align-top font-mono text-[10px]">{r['Intermediate file']}</td>
                <td className="p-2 align-top font-mono text-[10px]">{r['Production script (actual project file)']}</td>
                <td className="p-2 align-top font-mono text-[10px]">{r['Final output']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
