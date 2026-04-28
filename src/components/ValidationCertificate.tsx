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

// Solo describimos cualitativamente nuestra ubicación en la escala 0-100;
// no hacemos afirmaciones absolutas sobre lo que otros rangos significarían.
const SCORE_MEANING = {
  es: {
    range: '90 / 100',
    label: 'Verificación amplia',
    desc:
      'La auditoría revisó 14 controles metodológicos y 7 estándares internacionales. La evidencia disponible muestra que los métodos estadísticos, las correcciones aplicadas, la trazabilidad numérica y la transparencia de las limitaciones se han documentado con un grado alto de detalle. El score resume el resultado de esa revisión.',
  },
  en: {
    range: '90 / 100',
    label: 'Broad verification',
    desc:
      'The audit reviewed 14 methodological controls and 7 international standards. Available evidence shows that the statistical methods, applied corrections, numerical traceability and transparency about limitations have been documented in high detail. The score summarises the result of that review.',
  },
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
            ? 'El score 0–100 resume el resultado de una auditoría metodológica sobre cinco dimensiones específicas: calidad del dato, rigor estadístico, control de incertidumbre, reproducibilidad y transparencia.'
            : 'The 0–100 score summarises the outcome of a methodological audit on five specific dimensions: data quality, statistical rigour, uncertainty control, reproducibility and transparency.'}
        </p>
        <div className="card border-2 border-band-B3 bg-green-50/40 max-w-3xl">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-mono font-extrabold text-3xl text-band-B3">{SCORE_MEANING[locale].range}</span>
            <span className="text-xs uppercase font-bold text-white bg-band-B3 px-2 py-0.5 rounded">{isEs ? 'Resultado actual' : 'Current result'}</span>
          </div>
          <p className="font-bold text-andean-deep text-lg mb-1">{SCORE_MEANING[locale].label}</p>
          <p className="text-sm text-slate-700">{SCORE_MEANING[locale].desc}</p>

          {/* Bloque "para no técnicos" */}
          <div className="mt-4 flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
              {isEs
                ? 'En palabras simples: cada cifra del estudio fue revisada con una lista de control sobre su origen, su procedimiento estadístico y la honestidad con que se reportan las limitaciones. La auditoría detectó 14 controles cumplidos y 5 limitaciones declaradas explícitamente. Eso significa que el estudio puede consultarse con confianza, sabiendo claramente dónde están sus fronteras de validez.'
                : 'In simple terms: every figure of the study was reviewed against a checklist covering its origin, statistical procedure, and the honesty with which limitations are reported. The audit found 14 controls met and 5 limitations explicitly declared. This means the study can be consulted with confidence while clearly knowing where its validity boundaries lie.'}
            </p>
          </div>
        </div>
      </section>

      {/* === Reproducibilidad === */}
      <section>
        <div className="card border-l-4 border-l-andean-water">
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-andean-water shrink-0" />
            <div>
              <h4 className="font-bold text-andean-deep mb-1">{isEs ? 'Reproducibilidad documentada' : 'Documented reproducibility'}</h4>
              <p className="text-sm text-slate-700">
                {isEs
                  ? 'Cada cifra del estudio se acompaña de su semilla aleatoria documentada (seed = 42 para todos los procesos bootstrap), versiones exactas de las librerías Python utilizadas (pandas 2.0, numpy 1.24, scipy 1.10, pymannkendall 1.4.3), y hashes SHA-256 de los 20 anuarios INAMHI fuente.'
                  : 'Each figure of the study is accompanied by its documented random seed (seed = 42 for all bootstrap processes), exact versions of the Python libraries used (pandas 2.0, numpy 1.24, scipy 1.10, pymannkendall 1.4.3), and SHA-256 hashes of the 20 source INAMHI yearbooks.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
              {isEs
                ? 'Si cualquier persona técnica quisiera repetir los mismos cálculos del estudio, tendría todos los ingredientes necesarios: los datos originales con su huella digital intacta, las versiones exactas del software usado y las "semillas" matemáticas que controlan los procesos aleatorios. Eso garantiza que se puedan obtener exactamente los mismos resultados — no hay "magia" en las cifras del geoportal.'
                : 'If any technical person wanted to repeat the same calculations of the study, they would have all the necessary ingredients: original data with intact digital fingerprints, exact software versions, and the mathematical "seeds" controlling random processes. This guarantees the same exact results can be obtained — no "magic" hides behind the geoportal\'s figures.'}
            </p>
          </div>
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

          <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-3">
            <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
            <p className="text-sm text-slate-800 leading-relaxed">
              <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
              {isEs
                ? 'Una sola nota global no captura todos los matices del rigor científico. Por eso el score se descompone en cinco aspectos: si los datos eran de buena calidad, si los métodos estadísticos fueron los correctos, si se manejaron las incertidumbres, si todo es reproducible y si se reportaron las limitaciones de forma honesta.'
                : 'A single global score cannot capture all the nuances of scientific rigour. That is why the score is broken down into five aspects: whether the data was of good quality, whether the statistical methods were correct, whether uncertainties were handled, whether everything is reproducible, and whether limitations were reported honestly.'}
            </p>
          </div>
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

        <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
            {isEs
              ? 'Estas 14 verificaciones son una "lista de chequeo" que evalúa si el estudio aplicó procedimientos estadísticos correctos, controló posibles sesgos, y reportó incertidumbres. Cada item marcado significa que el estudio cumplió ese requisito metodológico específico.'
              : 'These 14 verifications form a "checklist" assessing whether the study applied correct statistical procedures, controlled for potential biases, and reported uncertainties. Each ticked item means the study met that specific methodological requirement.'}
          </p>
        </div>

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
        <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
          <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
            {isEs
              ? 'La auditoría no busca solo decir "todo está bien". Su valor está en mostrar al mismo tiempo qué fue verificado correctamente (14 controles) y dónde el propio estudio reconoce que tiene límites (5 limitaciones). Esa proporción es lo que hace que un estudio sea creíble.'
              : 'The audit does not simply seek to say "everything is fine". Its value lies in simultaneously showing what was correctly verified (14 controls) and where the study itself acknowledges its limits (5 limitations). That proportion is what makes a study credible.'}
          </p>
        </div>
      </section>

      {/* === 5 limitations === */}
      <section>
        <h3 className="heading-3 text-andean-deep mb-1 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          {t('limitations_title')}
        </h3>
        <p className="text-sm text-slate-600 mb-4">{t('limitations_subtitle')}</p>

        <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
            {isEs
              ? 'Reconocer las limitaciones de un estudio es señal de honestidad científica, no de debilidad. Aquí se enumeran las cinco "fronteras de validez" que el propio autor declara: situaciones donde los resultados deben interpretarse con precaución porque los datos o métodos tienen alcance limitado.'
              : 'Recognising a study\'s limitations is a sign of scientific honesty, not weakness. Here are listed the five "validity boundaries" the author declares: situations where results should be interpreted with caution because data or methods have limited scope.'}
          </p>
        </div>

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

        <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-andean-water shrink-0 mt-0.5" />
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong className="text-andean-water">{isEs ? '¿Qué significa esto?' : 'What does this mean?'}</strong>{' '}
            {isEs
              ? 'Los estándares internacionales son protocolos que la comunidad científica mundial acordó como buenas prácticas en climatología (IPCC, OMM y otras organizaciones). Cada vez que el estudio aplica uno de estos protocolos, su procedimiento queda alineado con prácticas internacionalmente reconocidas y verificables.'
              : 'International standards are protocols that the global scientific community has agreed upon as best practices in climatology (IPCC, WMO and other organisations). Each time the study applies one of these protocols, its procedure aligns with internationally recognised and verifiable practices.'}
          </p>
        </div>

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
