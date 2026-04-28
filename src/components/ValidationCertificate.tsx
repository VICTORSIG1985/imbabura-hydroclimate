'use client';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { dataUrl } from '@/lib/assets';
import { CheckCircle2, AlertTriangle, Award, Sparkles, Info } from 'lucide-react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Certificate {
  global_score: number;
  verdict: { code: string; label_es: string; label_en: string; summary_es: string; summary_en: string };
  score_breakdown: Array<{ dimension_es: string; dimension_en: string; icon: string; score: number; rationale_es: string; rationale_en: string }>;
  checks_passed: Array<{ id: number; check_es: string; check_en: string }>;
  limitations_declared: Array<{ id: string; scope_es: string; scope_en: string }>;
  international_standards: Array<{ standard: string; compliance: boolean; evidence_es: string }>;
  regional_comparison: { rows: Array<Record<string, any>> };
}

const SCORE_MEANING = {
  es: [
    { range: '90–100', label: 'Excelente', desc: 'Cumple estándares internacionales más rigurosos.', color: '#16a34a' },
    { range: '75–89',  label: 'Robusto',  desc: 'Defendible para Q1; mejoras opcionales.',          color: '#1d4ed8' },
    { range: '60–74',  label: 'Aceptable',desc: 'Defendible con ajustes obligatorios.',             color: '#f59e0b' },
    { range: '<60',    label: 'Insuficiente',desc: 'Requiere rehacer pasos críticos.',              color: '#dc2626' },
  ],
  en: [
    { range: '90–100', label: 'Excellent',     desc: 'Meets the most rigorous international standards.', color: '#16a34a' },
    { range: '75–89',  label: 'Robust',        desc: 'Defensible for Q1; optional improvements.',         color: '#1d4ed8' },
    { range: '60–74',  label: 'Acceptable',    desc: 'Defensible with mandatory adjustments.',            color: '#f59e0b' },
    { range: '<60',    label: 'Insufficient',  desc: 'Requires redoing critical steps.',                  color: '#dc2626' },
  ],
};

export default function ValidationCertificate() {
  const t = useTranslations('validation');
  const locale = useLocale() as 'es' | 'en';
  const [cert, setCert] = useState<Certificate | null>(null);

  useEffect(() => {
    fetch(dataUrl('validation_certificate.json')).then(r => r.json()).then(setCert);
  }, []);

  if (!cert) return <div className="text-slate-500 text-sm py-10 animate-pulse">Cargando…</div>;

  const isEs = locale === 'es';

  // Radar chart con 5 dimensiones
  const radarTrace = {
    type: 'scatterpolar',
    r: [...cert.score_breakdown.map(d => d.score), cert.score_breakdown[0].score],
    theta: [...cert.score_breakdown.map(d => isEs ? d.dimension_es : d.dimension_en), isEs ? cert.score_breakdown[0].dimension_es : cert.score_breakdown[0].dimension_en],
    fill: 'toself',
    fillcolor: 'rgba(29, 78, 216, 0.25)',
    line: { color: '#1d4ed8', width: 2.5 },
    marker: { size: 9, color: '#0a2540' },
  };

  // Barra horizontal de checks vs limitaciones
  const audit_summary = {
    type: 'bar',
    orientation: 'h',
    x: [cert.checks_passed.length, cert.limitations_declared.length],
    y: [isEs ? 'Verificaciones pasadas' : 'Checks passed', isEs ? 'Limitaciones declaradas' : 'Limitations declared'],
    marker: { color: ['#16a34a', '#f59e0b'] },
    text: [`${cert.checks_passed.length}`, `${cert.limitations_declared.length}`],
    textposition: 'auto',
  };

  return (
    <div className="space-y-12">
      {/* === HERO veredicto === */}
      <div className="bg-gradient-to-br from-andean-deep via-andean-water to-andean-paramo rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid lg:grid-cols-[auto_1fr] gap-6 items-center">
          {/* Score circular */}
          <div className="flex flex-col items-center shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="14" />
              <circle
                cx="80" cy="80" r="68"
                fill="none" stroke="#fff" strokeWidth="14"
                strokeDasharray={`${(cert.global_score / 100) * 2 * Math.PI * 68} ${2 * Math.PI * 68}`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
              <text x="80" y="78" textAnchor="middle" dominantBaseline="central" fontSize="44" fontWeight="900" fill="#fff">{cert.global_score}</text>
              <text x="80" y="105" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.8)">/ 100</text>
            </svg>
            <p className="text-xs font-bold uppercase tracking-wider mt-2 text-andean-snow/90">{t('global_score')}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider font-bold text-andean-snow/80 mb-1">{t('verdict_badge')}</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{isEs ? cert.verdict.label_es : cert.verdict.label_en}</h2>
            <p className="text-andean-snow/90 text-sm leading-relaxed">{isEs ? cert.verdict.summary_es : cert.verdict.summary_en}</p>
          </div>
        </div>
      </div>

      {/* === ¿Qué significa este score? === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1 flex items-center gap-2">
          <Info className="w-5 h-5 text-andean-water" />
          {isEs ? '¿Qué significa este score?' : 'What does this score mean?'}
        </h3>
        <p className="text-sm text-slate-600 mb-4 max-w-3xl">
          {isEs
            ? 'El score 0–100 sintetiza la robustez de la investigación frente a los criterios usados por revistas internacionales (IPCC, Wiley, RMetS) y permite comunicar al público técnico (GAD, MAATE, comunidad científica) en qué punto del rigor metodológico se encuentra el estudio.'
            : 'The 0–100 score synthesises the research\'s robustness against criteria used by international journals (IPCC, Wiley, RMetS) and communicates to the technical public (GAD, MAATE, scientific community) where the methodological rigour stands.'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCORE_MEANING[locale].map((b, i) => {
            const here = cert.global_score >= +b.range.split('–')[0].replace('<', '0');
            const inRange = (() => {
              const score = cert.global_score;
              if (b.range === '90–100') return score >= 90;
              if (b.range === '75–89')  return score >= 75 && score <= 89;
              if (b.range === '60–74')  return score >= 60 && score <= 74;
              return score < 60;
            })();
            return (
              <div key={i} className={`p-4 rounded-xl border-2 ${inRange ? 'shadow-lg' : 'opacity-50'}`} style={{ borderColor: b.color, background: inRange ? b.color + '12' : '#f9fafb' }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono font-bold text-lg" style={{ color: b.color }}>{b.range}</span>
                  {inRange && <span className="text-[10px] uppercase font-bold text-white px-1.5 py-0.5 rounded" style={{ background: b.color }}>{isEs ? 'Aquí' : 'Here'}</span>}
                </div>
                <p className="font-bold text-andean-deep">{b.label}</p>
                <p className="text-xs text-slate-700 mt-1">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Reproducibilidad (única tarjeta sobre el aporte) === */}
      <section>
        <div className="card border-l-4 border-l-andean-water max-w-3xl">
          <Sparkles className="w-6 h-6 text-andean-water mb-2" />
          <h4 className="font-bold text-andean-deep mb-1">{isEs ? 'Reproducibilidad' : 'Reproducibility'}</h4>
          <p className="text-sm text-slate-700">
            {isEs
              ? 'Cada cifra del estudio se acompaña de su semilla aleatoria documentada (seed = 42 para todos los procesos bootstrap), versiones exactas de las librerías Python utilizadas (pandas 2.0, numpy 1.24, scipy 1.10, pymannkendall 1.4.3), y hashes SHA-256 de los 20 anuarios INAMHI fuente. Esto permite que cualquier persona técnica reproduzca el flujo de procesamiento completo y obtenga exactamente los mismos resultados.'
              : 'Each figure of the study is accompanied by its documented random seed (seed = 42 for all bootstrap processes), exact versions of the Python libraries used (pandas 2.0, numpy 1.24, scipy 1.10, pymannkendall 1.4.3), and SHA-256 hashes of the 20 source INAMHI yearbooks. This allows any technical person to reproduce the complete processing pipeline and obtain exactly the same results.'}
          </p>
        </div>
      </section>

      {/* === Radar 5 dimensiones === */}
      <section className="grid lg:grid-cols-[1fr_1fr] gap-6 items-center">
        <div>
          <h3 className="heading-3 text-andean-deep mb-1">{t('scoring_intro')}</h3>
          <p className="text-sm text-slate-600 mb-3">
            {isEs
              ? 'Cada dimensión se evalúa de forma independiente. Una alta puntuación en transparencia compensa una limitación de cobertura observacional, por ejemplo.'
              : 'Each dimension is evaluated independently. A high transparency score compensates, for instance, a limited observational coverage.'}
          </p>
          <div className="space-y-2">
            {cert.score_breakdown.map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-andean-deep">{isEs ? d.dimension_es : d.dimension_en}</p>
                  <div className="h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.score >= 90 ? '#16a34a' : d.score >= 80 ? '#1d4ed8' : '#f59e0b' }} />
                  </div>
                </div>
                <span className="font-extrabold text-andean-deep text-lg shrink-0">{d.score}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <Plot
            data={[radarTrace as any]}
            layout={{
              height: 380,
              margin: { l: 30, r: 30, t: 20, b: 30 },
              paper_bgcolor: 'transparent',
              polar: {
                bgcolor: '#fafafa',
                radialaxis: { visible: true, range: [0, 100], gridcolor: '#cbd5e1', tickfont: { size: 10 } },
                angularaxis: { tickfont: { size: 11, color: '#0a2540' } },
              },
              showlegend: false,
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%' }}
          />
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
              <div className="mt-0.5 w-7 h-7 rounded-full bg-green-600 grid place-items-center text-white text-xs font-bold shrink-0">
                {c.id}
              </div>
              <p className="text-sm text-slate-800 leading-snug">{isEs ? c.check_es : c.check_en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === Resumen visual checks vs limitations === */}
      <section className="card">
        <h3 className="font-bold text-andean-deep mb-3">
          {isEs ? 'Síntesis del proceso de auditoría' : 'Audit process synthesis'}
        </h3>
        <Plot
          data={[audit_summary as any]}
          layout={{
            height: 180, margin: { l: 180, r: 30, t: 20, b: 30 },
            paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
            xaxis: { range: [0, Math.max(cert.checks_passed.length, 16) + 2], gridcolor: '#e5e7eb', showgrid: true } as any,
            yaxis: { tickfont: { size: 12 } } as any,
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%' }}
        />
        <p className="text-xs text-slate-500 italic">
          {isEs
            ? 'La auditoría no busca esconder limitaciones, sino enmarcarlas. 14 controles exitosos + 5 limitaciones explícitas = transparencia metodológica.'
            : 'The audit does not seek to hide limitations, but to frame them. 14 successful controls + 5 explicit limitations = methodological transparency.'}
        </p>
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
              <div className="mt-0.5 w-9 h-7 rounded bg-amber-500 grid place-items-center text-white text-xs font-bold font-mono shrink-0">{l.id}</div>
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

    </div>
  );
}
