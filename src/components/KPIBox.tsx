'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown, Lightbulb } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: 'red' | 'blue' | 'green' | 'amber' | 'default';
  explainKey?: 'period' | 'warming' | 'enso' | 'cmip6' | 'lapse' | 'extremes';
}

const ACCENTS = {
  red:    'border-red-200 hover:border-red-400',
  blue:   'border-blue-200 hover:border-blue-400',
  green:  'border-green-200 hover:border-green-400',
  amber:  'border-amber-200 hover:border-amber-400',
  default: 'border-slate-200 hover:border-andean-water',
};

const KPI_EXPLAIN: Record<string, { es: { title: string; body: string }; en: { title: string; body: string } }> = {
  period: {
    es: {
      title: 'Período observado: 44 años (1981–2025)',
      body: 'Este es el rango de tiempo durante el cual se analizan datos climáticos reales. Cuarenta y cuatro años de información permiten distinguir cambios de fondo del clima respecto a las variaciones normales año tras año. La climatología internacional recomienda al menos 30 años de datos para hablar de tendencias confiables; este estudio supera ese umbral con 44 años, integrando registros locales digitalizados con productos satelitales globales.',
    },
    en: {
      title: 'Observed period: 44 years (1981–2025)',
      body: 'This is the time range during which actual climate data are analysed. Forty-four years of information allow background climate changes to be distinguished from year-to-year normal variations. International climatology recommends at least 30 years of data to discuss reliable trends; this study exceeds that threshold with 44 years, integrating digitised local records with global satellite products.',
    },
  },
  warming: {
    es: {
      title: 'Calentamiento regional: +0.49 °C en 44 años',
      body: 'En las últimas cuatro décadas, la temperatura promedio en Imbabura ha subido aproximadamente medio grado centígrado. Aunque parece poco, una subida sostenida de medio grado a nivel regional tiene efectos reales: cambia el momento en que florecen las plantas, altera los ciclos del agua y desplaza los pisos altitudinales donde sobreviven ciertas especies. De los 16 píxeles independientes analizados con el reanálisis ERA5-Land, 14 muestran este aumento de manera estadísticamente robusta.',
    },
    en: {
      title: 'Regional warming: +0.49 °C over 44 years',
      body: 'During the last four decades, average temperature in Imbabura has risen roughly half a degree Celsius. Though it sounds small, a sustained half-degree rise at regional scale has real effects: it shifts plant flowering times, alters water cycles, and displaces altitudinal bands where certain species survive. Of the 16 independent pixels analysed with ERA5-Land reanalysis, 14 show this increase in a statistically robust way.',
    },
  },
  enso: {
    es: {
      title: 'ENSO–precipitación: ρ = −0.23',
      body: 'Este número resume la conexión entre el fenómeno El Niño/La Niña en el Pacífico y la lluvia en Imbabura. El signo negativo significa que cuando el océano se calienta (fase El Niño), Imbabura recibe menos lluvia. La señal aparece consistentemente en las 21 estaciones analizadas y se manifiesta unos 3 meses después de que comienza el calentamiento oceánico. Esta correlación es útil para anticipar temporadas más secas durante eventos El Niño fuertes y planificar gestión hídrica.',
    },
    en: {
      title: 'ENSO–precipitation: ρ = −0.23',
      body: 'This number summarises the link between the El Niño / La Niña phenomenon in the Pacific and rainfall in Imbabura. The negative sign means that when the ocean warms (El Niño phase), Imbabura receives less rainfall. The signal appears consistently across all 21 stations and manifests roughly 3 months after the oceanic warming begins. This correlation is useful to anticipate drier seasons during strong El Niño events and plan water management.',
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
      body: 'Aunque la cantidad total de lluvia anual en Imbabura no ha cambiado mucho, sí ha aumentado la intensidad de los días más lluviosos. El índice R95p (lluvia caída en días sobre el percentil 95) crece a razón de 4.17 mm cada año. En palabras simples: cuando llueve, llueve más fuerte. Esta intensificación de eventos extremos es coherente con el calentamiento global y tiene implicaciones para inundaciones, deslizamientos y diseño de obras hidráulicas.',
    },
    en: {
      title: 'CHIRPS precipitation extremes: +4.17 mm/year',
      body: 'Although total annual rainfall in Imbabura has not changed much, the intensity of the rainiest days has increased. The R95p index (rainfall on days above the 95th percentile) grows at 4.17 mm per year. In simple terms: when it rains, it rains harder. This intensification of extreme events is consistent with global warming and has implications for floods, landslides and hydraulic infrastructure design.',
    },
  },
};

export default function KPIBox({ label, value, sub, accent = 'default', explainKey }: Props) {
  const locale = useLocale() as 'es' | 'en';
  const [open, setOpen] = useState(false);
  const explanation = explainKey ? KPI_EXPLAIN[explainKey]?.[locale] : null;

  return (
    <div className={`bg-white border-2 ${ACCENTS[accent]} rounded-xl shadow-sm transition-all overflow-hidden ${open ? 'col-span-2 sm:col-span-3 lg:col-span-6' : ''}`}>
      <div className="p-5 flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-andean-deep mt-1 leading-tight">{value}</span>
        {sub && <span className="text-xs text-slate-600 mt-1">{sub}</span>}
        {explanation && (
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-andean-water hover:text-andean-deep transition-colors group"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>
              {open
                ? (locale === 'es' ? 'Ocultar explicación' : 'Hide explanation')
                : (locale === 'es' ? '¿Qué significa esto?' : 'What does this mean?')
              }
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Explicación expandible inline */}
      {open && explanation && (
        <div className="border-t border-slate-200 bg-blue-50/60 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 grid place-items-center shrink-0">
              <Lightbulb className="w-4 h-4 text-andean-water" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-andean-deep text-base mb-1.5 leading-snug">
                {explanation.title}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {explanation.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
