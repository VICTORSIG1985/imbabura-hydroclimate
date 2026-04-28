'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { X, Lightbulb } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: 'red' | 'blue' | 'green' | 'amber' | 'default';
  /** key para buscar la explicación en el bloque KPI_EXPLAIN */
  explainKey?: 'period' | 'warming' | 'enso' | 'cmip6' | 'lapse' | 'extremes';
}

const ACCENTS = {
  red:    'border-red-200',
  blue:   'border-blue-200',
  green:  'border-green-200',
  amber:  'border-amber-200',
  default: 'border-slate-200',
};

const KPI_EXPLAIN: Record<string, { es: { title: string; body: string }; en: { title: string; body: string } }> = {
  period: {
    es: {
      title: 'Período observado: 44 años (1981–2025)',
      body: 'Este es el rango de tiempo durante el cual se analizan datos climáticos reales (medidos por estaciones, satélites o reanálisis atmosféricos). Cuarenta y cuatro años de información permiten distinguir cambios de fondo del clima respecto a las variaciones normales año tras año. La climatología internacional recomienda al menos 30 años de datos para hablar de tendencias confiables; este estudio supera ese umbral con 44 años, integrando registros locales digitalizados con productos satelitales globales.',
    },
    en: {
      title: 'Observed period: 44 years (1981–2025)',
      body: 'This is the time range during which actual climate data are analysed (measured by stations, satellites or atmospheric reanalyses). Forty-four years of information allow background climate changes to be distinguished from year-to-year normal variations. International climatology recommends at least 30 years of data to discuss reliable trends; this study exceeds that threshold with 44 years, integrating digitised local records with global satellite products.',
    },
  },
  warming: {
    es: {
      title: 'Calentamiento regional: +0.49 °C en 44 años',
      body: 'En las últimas cuatro décadas, la temperatura promedio en Imbabura ha subido aproximadamente medio grado centígrado. Aunque parece poco, una subida sostenida de medio grado a nivel regional tiene efectos reales: cambia el momento en que florecen las plantas, altera los ciclos del agua, y desplaza los pisos altitudinales donde sobreviven ciertas especies. De los 16 píxeles independientes analizados con el reanálisis ERA5-Land, 14 muestran este aumento de manera estadísticamente robusta, lo que significa que no es casualidad ni ruido del dato.',
    },
    en: {
      title: 'Regional warming: +0.49 °C over 44 years',
      body: 'During the last four decades, average temperature in Imbabura has risen roughly half a degree Celsius. Though it sounds small, a sustained half-degree rise at regional scale has real effects: it shifts plant flowering times, alters water cycles, and displaces altitudinal bands where certain species survive. Of the 16 independent pixels analysed with ERA5-Land reanalysis, 14 show this increase in a statistically robust way, meaning it is neither coincidence nor data noise.',
    },
  },
  enso: {
    es: {
      title: 'ENSO–precipitación: ρ = −0.23',
      body: 'Este número resume la conexión entre el fenómeno El Niño/La Niña en el Pacífico y la lluvia en Imbabura. El signo negativo significa que cuando el océano se calienta (fase El Niño), Imbabura recibe menos lluvia. La señal aparece consistentemente en las 21 estaciones analizadas y se manifiesta unos 3 meses después de que comienza el calentamiento oceánico. Esta correlación es útil para anticipar temporadas más secas durante eventos El Niño fuertes y planificar gestión hídrica.',
    },
    en: {
      title: 'ENSO–precipitation: ρ = −0.23',
      body: 'This number summarises the link between the El Niño / La Niña phenomenon in the Pacific and rainfall in Imbabura. The negative sign means that when the ocean warms (El Niño phase), Imbabura receives less rainfall. The signal appears consistently across all 21 stations analysed and manifests roughly 3 months after the oceanic warming begins. This correlation is useful to anticipate drier seasons during strong El Niño events and plan water management.',
    },
  },
  cmip6: {
    es: {
      title: 'Proyección 2041–2070: +1.1 a +2.1 °C',
      body: 'Diez modelos climáticos internacionales (los mismos utilizados por el panel del IPCC) proyectan que Imbabura se calentará entre 1.1 y 2.1 °C hacia mediados de siglo. La cifra exacta depende de cuánto reduzca el mundo sus emisiones: el límite inferior corresponde al escenario optimista (SSP1-2.6, fuerte mitigación) y el superior al pesimista (SSP5-8.5, sin mitigación). Los 10 modelos coinciden en la dirección del cambio, lo que da alta confianza al resultado.',
    },
    en: {
      title: 'Projection 2041–2070: +1.1 to +2.1 °C',
      body: 'Ten international climate models (the same used by the IPCC panel) project that Imbabura will warm between 1.1 and 2.1 °C by mid-century. The exact figure depends on how much the world reduces emissions: the lower bound corresponds to the optimistic scenario (SSP1-2.6, strong mitigation) and the upper to the pessimistic one (SSP5-8.5, no mitigation). All 10 models agree on the direction of change, giving high confidence to the result.',
    },
  },
  lapse: {
    es: {
      title: 'Lapse rate in-situ: −8.24 °C/km',
      body: 'Este número describe cuánto baja la temperatura por cada kilómetro que se sube en altitud en Imbabura. Calculado con 7 estaciones meteorológicas reales del INAMHI (1994–2013), el resultado es −8.24 °C/km — significa que entre el valle del Chota a 675 m y el páramo de Inguincho a 3 140 m, la temperatura natural cae unos 20 °C por la diferencia de altura. Es uno de los gradientes térmicos más pronunciados del planeta, característico de los Andes tropicales secos. La regresión tiene un R² de 0.97, lo que confirma que la altitud explica casi toda la variación térmica regional.',
    },
    en: {
      title: 'In-situ lapse rate: −8.24 °C/km',
      body: 'This number describes how much temperature drops per kilometre of elevation gained in Imbabura. Calculated with 7 actual INAMHI weather stations (1994–2013), the result is −8.24 °C/km — meaning between the Chota valley at 675 m and the Inguincho páramo at 3,140 m, natural temperature drops about 20 °C due to elevation difference. It is one of the steepest thermal gradients on the planet, characteristic of dry tropical Andes. The regression has R² = 0.97, confirming elevation explains nearly all regional thermal variation.',
    },
  },
  extremes: {
    es: {
      title: 'Extremos de precipitación CHIRPS: +4.17 mm/año',
      body: 'Aunque la cantidad total de lluvia anual en Imbabura no ha cambiado mucho, sí ha aumentado la intensidad de los días más lluviosos. El índice R95p (lluvia caída en días sobre el percentil 95) crece a razón de 4.17 mm cada año. En palabras simples: cuando llueve, llueve más fuerte. Esta intensificación de eventos extremos es coherente con el calentamiento global (ley termodinámica de Clausius-Clapeyron: aire más cálido retiene más humedad, descargada en eventos más concentrados) y tiene implicaciones para inundaciones, deslizamientos y diseño de obras hidráulicas.',
    },
    en: {
      title: 'CHIRPS precipitation extremes: +4.17 mm/year',
      body: 'Although total annual rainfall in Imbabura has not changed much, the intensity of the rainiest days has increased. The R95p index (rainfall on days above the 95th percentile) grows at 4.17 mm per year. In simple terms: when it rains, it rains harder. This intensification of extreme events is consistent with global warming (Clausius-Clapeyron thermodynamic law: warmer air holds more moisture, discharged in more concentrated events) and has implications for floods, landslides and hydraulic infrastructure design.',
    },
  },
};

export default function KPIBox({ label, value, sub, accent = 'default', explainKey }: Props) {
  const locale = useLocale() as 'es' | 'en';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const explanation = explainKey ? KPI_EXPLAIN[explainKey]?.[locale] : null;
  const isClickable = !!explanation;

  const inner = (
    <div className={`flex flex-col bg-white border-2 ${ACCENTS[accent]} rounded-xl p-5 shadow-sm transition-all
      ${isClickable ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-2xl sm:text-3xl font-extrabold text-andean-deep mt-1 leading-tight">{value}</span>
      {sub && <span className="text-xs text-slate-600 mt-1">{sub}</span>}
      {isClickable && (
        <span className="text-[10px] text-andean-water mt-2 inline-flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          {locale === 'es' ? 'Click para entender' : 'Click to understand'}
        </span>
      )}
    </div>
  );

  if (!isClickable) return inner;

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-left">
        {inner}
      </button>
      {open && explanation && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-andean-deep text-white grid place-items-center hover:bg-andean-water transition"
              aria-label="close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center shrink-0">
                <Lightbulb className="w-5 h-5 text-andean-water" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-andean-water">
                  {locale === 'es' ? 'Hallazgo clave explicado' : 'Key finding explained'}
                </p>
                <h3 className="font-bold text-andean-deep text-lg mt-0.5 leading-snug">
                  {explanation.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {explanation.body}
            </p>
            <p className="text-[10px] text-slate-400 mt-4 italic">
              {locale === 'es' ? 'Pulsa Esc o fuera del cuadro para cerrar' : 'Press Esc or click outside to close'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
