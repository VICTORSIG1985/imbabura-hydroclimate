interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: 'red' | 'blue' | 'green' | 'amber' | 'default';
}

const ACCENTS = {
  red:    'border-red-200 from-red-50',
  blue:   'border-blue-200 from-blue-50',
  green:  'border-green-200 from-green-50',
  amber:  'border-amber-200 from-amber-50',
  default: 'border-slate-200 from-andean-snow',
};

export default function KPIBox({ label, value, sub, accent = 'default' }: Props) {
  return (
    <div className={`flex flex-col bg-gradient-to-br ${ACCENTS[accent]} to-white border rounded-xl p-5 hover:shadow-md transition-shadow`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-2xl sm:text-3xl font-extrabold text-andean-deep mt-1 leading-tight">{value}</span>
      {sub && <span className="text-xs text-slate-600 mt-1">{sub}</span>}
    </div>
  );
}
