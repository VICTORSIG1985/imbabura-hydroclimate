'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { dataUrl, docUrl } from '@/lib/assets';
import { CheckCircle2, AlertTriangle, ShieldCheck, Award, Download } from 'lucide-react';

interface Certificate {
  version: string;
  issued_date: string;
  auditor: string;
  audited_subject: {
    manuscript: string;
    author: string;
    year: number;
    journal: string;
    status: string;
    doi: string;
  };
  verdict: { code: string; label_es: string; label_en: string; summary_es: string; summary_en: string };
  global_score: number;
  score_breakdown: Array<{ dimension_es: string; dimension_en: string; icon: string; score: number; rationale_es: string; rationale_en: string }>;
  checks_passed: Array<{ id: number; check_es: string; check_en: string }>;
  limitations_declared: Array<{ id: string; scope_es: string; scope_en: string }>;
  international_standards: Array<{ standard: string; compliance: boolean; evidence_es: string }>;
  regional_comparison: { table_caption_es: string; table_caption_en: string; rows: Array<Record<string, any>> };
  recommended_additional_validations: Array<{ id: string; name_es: string; name_en: string }>;
}

const scoreColor = (s: number) => {
  if (s >= 90) return 'text-green-700 bg-green-50 border-green-200';
  if (s >= 80) return 'text-andean-water bg-blue-50 border-blue-200';
  if (s >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
};

const ScoreCircle = ({ score, size = 140 }: { score: number; size?: number }) => {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 90 ? '#16a34a' : score >= 80 ? '#1d4ed8' : score >= 70 ? '#f59e0b' : '#dc2626';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="32"
        fontWeight="800"
        fill={color}
      >
        {score}
      </text>
      <text
        x={size / 2} y={size / 2 + 24}
        textAnchor="middle"
        fontSize="10"
        fill="#64748b"
      >
        / 100
      </text>
    </svg>
  );
};

const TickIcon = (v: any) => {
  if (v === true)         return <span className="text-green-600 font-bold">✓</span>;
  if (v === 'partial')    return <span className="text-amber-500 font-bold">~</span>;
  if (v === false)        return <span className="text-slate-300">·</span>;
  return <span className="text-slate-400">{String(v)}</span>;
};

export default function ValidationCertificate() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [cert, setCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch(dataUrl('validation_certificate.json')).then(r => r.json()).then(setCert);
  }, []);

  if (!cert) return <div className="text-slate-500 text-sm py-10 animate-pulse">Cargando certificado…</div>;

  const isEs = locale === 'es';
  const verdictLabel = isEs ? cert.verdict.label_es : cert.verdict.label_en;
  const verdictSummary = isEs ? cert.verdict.summary_es : cert.verdict.summary_en;

  return (
    <div className="space-y-10">
      {/* === Hero certificado === */}
      <div className="bg-gradient-to-br from-andean-deep via-andean-water to-andean-paramo rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative grid lg:grid-cols-[auto_1fr] gap-6 items-center">
          <ScoreCircle score={cert.global_score} size={170} />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-andean-snow" />
              <span className="text-xs uppercase tracking-wider font-bold text-andean-snow">{t('verdict_badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{verdictLabel}</h2>
            <p className="text-andean-snow/90 text-sm leading-relaxed">{verdictSummary}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-andean-snow/80">
              <span><strong className="text-white">{t('issued_by')}:</strong> {cert.auditor}</span>
              <span><strong className="text-white">{t('issued_date')}:</strong> {cert.issued_date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* === 5 dimensiones === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-2">{t('global_score')}</h3>
        <p className="text-sm text-slate-600 mb-5">{t('scoring_intro')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {cert.score_breakdown.map((d, i) => {
            const cls = scoreColor(d.score);
            return (
              <div key={i} className={`flex flex-col p-4 rounded-xl border-2 ${cls}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{d.icon}</span>
                  <span className="text-3xl font-extrabold">{d.score}</span>
                  <span className="text-xs font-medium opacity-70">/100</span>
                </div>
                <p className="text-sm font-bold mt-1">{isEs ? d.dimension_es : d.dimension_en}</p>
                <p className="text-xs mt-1 opacity-80 leading-snug">{isEs ? d.rationale_es : d.rationale_en}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === 14 checks === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          {t('checks_title')}
        </h3>
        <p className="text-sm text-slate-600 mb-4">{t('checks_subtitle')}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {cert.checks_passed.map(c => (
            <div key={c.id} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg p-3">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-green-600 grid place-items-center text-white text-xs font-bold shrink-0">
                {c.id}
              </div>
              <p className="text-sm text-slate-800 leading-snug">{isEs ? c.check_es : c.check_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === 5 limitations === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          {t('limitations_title')}
        </h3>
        <p className="text-sm text-slate-600 mb-4">{t('limitations_subtitle')}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {cert.limitations_declared.map(l => (
            <div key={l.id} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="mt-0.5 w-9 h-6 rounded bg-amber-500 grid place-items-center text-white text-xs font-bold font-mono shrink-0">
                {l.id}
              </div>
              <p className="text-sm text-slate-800 leading-snug">{isEs ? l.scope_es : l.scope_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Estándares === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1">{t('standards_title')}</h3>
        <p className="text-sm text-slate-600 mb-4">{t('standards_subtitle')}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {cert.international_standards.map((s, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-3">
              <Award className="w-5 h-5 text-andean-water shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-andean-deep">{s.standard}</p>
                <p className="text-xs text-slate-600 mt-0.5">{s.evidence_es}</p>
              </div>
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          ))}
        </div>
      </section>

      {/* === Comparativo regional === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1">{t('comparison_title')}</h3>
        <p className="text-sm text-slate-600 mb-4">{t('comparison_subtitle')}</p>
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-andean-snow border-b border-slate-200">
              <tr>
                <th className="text-left p-3 font-bold text-andean-deep">{isEs ? 'Estudio' : 'Study'}</th>
                <th className="text-center p-3 font-bold text-andean-deep">MMK</th>
                <th className="text-center p-3 font-bold text-andean-deep">FDR</th>
                <th className="text-center p-3 font-bold text-andean-deep">Bootstrap</th>
                <th className="text-center p-3 font-bold text-andean-deep">{isEs ? 'Trazabilidad' : 'Traceability'}</th>
                <th className="text-center p-3 font-bold text-andean-deep">{isEs ? 'Bilingüe' : 'Bilingual'}</th>
              </tr>
            </thead>
            <tbody>
              {cert.regional_comparison.rows.map((r, i) => {
                const isOurs = r.study.toLowerCase().includes('pinto-páez');
                return (
                  <tr key={i} className={isOurs ? 'bg-green-50 border-y-2 border-green-200' : 'border-b border-slate-100'}>
                    <td className={`p-3 ${isOurs ? 'font-bold text-andean-deep' : 'text-slate-700'}`}>
                      {r.study}
                      {isOurs && <span className="ml-2 text-[10px] uppercase bg-green-600 text-white px-1.5 py-0.5 rounded">{isEs ? 'Este estudio' : 'This study'}</span>}
                    </td>
                    <td className="p-3 text-center text-lg">{TickIcon(r.mmk)}</td>
                    <td className="p-3 text-center text-lg">{TickIcon(r.fdr)}</td>
                    <td className="p-3 text-center text-lg">{TickIcon(r.bootstrap)}</td>
                    <td className="p-3 text-center text-lg">{TickIcon(r.traceability)}</td>
                    <td className="p-3 text-center text-lg">{TickIcon(r.bilingual)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 italic mt-2">
          ✓ {isEs ? 'Cumple' : 'Compliant'} · ~ {isEs ? 'Parcial' : 'Partial'} · · {isEs ? 'No reportado' : 'Not reported'}
        </p>
      </section>

      {/* === Descarga === */}
      <div className="card flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h3 className="font-bold text-andean-deep">{isEs ? 'Documento técnico completo' : 'Full technical document'}</h3>
          <p className="text-sm text-slate-600 mt-1">
            {isEs
              ? '5 700 palabras · 6 capas de auditoría · 23 referencias · listo para revisores externos.'
              : '5,700 words · 6 audit layers · 23 references · ready for external reviewers.'}
          </p>
        </div>
        <a href={docUrl('Auditoria_DS_Metrics.md')} download className="btn-primary text-sm shrink-0">
          <Download className="w-4 h-4" />
          {t('view_full_audit')}
        </a>
      </div>
    </div>
  );
}
