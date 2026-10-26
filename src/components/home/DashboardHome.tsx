import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Receipt,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Card } from '../ui';

// Datos estáticos de ejemplo hasta que existan los endpoints de reportes.
const SERIES_CURRENT = '#4f46e5';
const GRID = '#e2e8f0';
const AXIS_TEXT = '#64748b';

// Operación desde julio de 2026: curva de adopción con aceleración en el
// último bimestre. Todo lo de octubre suma las 68 reservas del mes.
const monthlyBookings = [
  { mes: 'Jul', reservas: 18, participacion: 10.2 },
  { mes: 'Ago', reservas: 32, participacion: 18.2 },
  { mes: 'Sep', reservas: 58, participacion: 33.0 },
  { mes: 'Oct', reservas: 68, participacion: 38.6 },
];

const totalBookings = monthlyBookings.reduce((sum, m) => sum + m.reservas, 0);

const kpis = [
  {
    label: 'Ingresos del mes',
    value: '$16,7 M',
    delta: 20.7,
    icon: DollarSign,
    trend: [4.1, 7.6, 13.8, 16.7],
  },
  {
    label: 'Reservas del mes',
    value: '68',
    delta: 17.2,
    icon: CalendarCheck,
    trend: [18, 32, 58, 68],
  },
  {
    label: 'Ticket promedio',
    value: '$245.000',
    delta: 2.9,
    icon: Receipt,
    trend: [228, 236, 238, 245],
  },
  {
    label: 'Tasa de cancelación',
    value: '5,9 %',
    delta: -14.5,
    // En esta métrica, bajar es bueno.
    invert: true,
    icon: Percent,
    trend: [11.1, 9.4, 6.9, 5.9],
  },
];

const bookingsByType = [
  { tipo: 'Hoteles', reservas: 26 },
  { tipo: 'Experiencias', reservas: 19 },
  { tipo: 'Transportes', reservas: 12 },
  { tipo: 'Restaurantes', reservas: 7 },
  { tipo: 'Viajes', reservas: 4 },
];

const bookingStatus = [
  { label: 'Confirmadas', value: 56, color: '#22c55e', icon: CheckCircle2 },
  { label: 'Pendientes', value: 8, color: '#eab308', icon: Clock },
  { label: 'Canceladas', value: 4, color: '#ef4444', icon: XCircle },
];

const topDestinations = [
  { ciudad: 'Cartagena', reservas: 21, ingresos: '$5,4 M' },
  { ciudad: 'Santa Marta', reservas: 16, ingresos: '$4,0 M' },
  { ciudad: 'Medellín', reservas: 13, ingresos: '$3,0 M' },
  { ciudad: 'San Andrés', reservas: 10, ingresos: '$2,9 M' },
  { ciudad: 'Bogotá', reservas: 8, ingresos: '$1,4 M' },
];

const recentBookings = [
  { cliente: 'Laura Gómez', servicio: 'Hotel Las Américas', fecha: 'Hoy, 10:42', monto: '$1.240.000', estado: 'Confirmada' },
  { cliente: 'Andrés Pérez', servicio: 'Tour Islas del Rosario', fecha: 'Hoy, 09:15', monto: '$380.000', estado: 'Pendiente' },
  { cliente: 'María Rodríguez', servicio: 'Traslado aeropuerto', fecha: 'Ayer, 18:03', monto: '$95.000', estado: 'Confirmada' },
  { cliente: 'Camilo Torres', servicio: 'Cena Andrés Carne de Res', fecha: 'Ayer, 14:27', monto: '$420.000', estado: 'Cancelada' },
  { cliente: 'Valentina Ruiz', servicio: 'Paquete Eje Cafetero', fecha: '24 oct, 11:50', monto: '$2.860.000', estado: 'Confirmada' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'error'> = {
  Confirmada: 'success',
  Pendiente: 'warning',
  Cancelada: 'error',
};

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipEntry[];
  unit?: (value: number) => string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, label, payload, unit }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-secondary-100 bg-white px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-medium text-secondary-900 mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-secondary-600">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}</span>
          <span className="ml-auto pl-4 font-semibold text-secondary-900 tabular-nums">
            {unit ? unit(Number(entry.value)) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const MonthTooltip: React.FC<{ active?: boolean; label?: string; payload?: { payload: (typeof monthlyBookings)[number] }[] }> = ({
  active,
  label,
  payload,
}) => {
  if (!active || !payload?.length) return null;
  const { reservas, participacion } = payload[0].payload;
  return (
    <div className="rounded-xl border border-secondary-100 bg-white px-3 py-2 shadow-soft-lg text-sm">
      <p className="font-medium text-secondary-900 mb-1">{label}</p>
      <p className="text-secondary-600">
        <span className="font-semibold text-secondary-900 tabular-nums">{reservas}</span> reservas
      </p>
      <p className="text-secondary-500 tabular-nums">{participacion.toLocaleString('es-CO')}% del total</p>
    </div>
  );
};

const KpiCard: React.FC<(typeof kpis)[number]> = ({ label, value, delta, icon: Icon, trend, invert }) => {
  const isGood = invert ? delta < 0 : delta > 0;
  const DeltaIcon = delta > 0 ? ArrowUpRight : ArrowDownRight;
  const data = trend.map((v, i) => ({ i, v }));

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500">{label}</p>
          <p className="mt-2 text-2xl font-display font-bold text-secondary-900 tabular-nums">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isGood ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'
            }`}
          >
            <DeltaIcon className="h-3.5 w-3.5" />
            {Math.abs(delta).toLocaleString('es-CO')}%
          </span>
          <span className="text-xs text-secondary-400">vs. mes anterior</span>
        </div>
        <div className="h-10 w-24" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={SERIES_CURRENT} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

interface DashboardHomeProps {
  userName?: string;
  onNavigate: (section: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ userName, onNavigate }) => {
  const totalStatus = bookingStatus.reduce((sum, s) => sum + s.value, 0);
  const maxDestination = Math.max(...topDestinations.map((d) => d.reservas));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-display font-bold text-secondary-900">¡Hola, {userName || 'Administrador'}! 👋</h2>
            <Badge variant="secondary">Datos de ejemplo</Badge>
          </div>
          <p className="mt-1 text-secondary-500">Así va tu negocio desde que arrancó la operación en julio.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate('reservas')}>Ver reservas</Button>
          <Button onClick={() => onNavigate('servicios')}>Gestionar servicios</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-semibold text-secondary-900">Reservas por mes</h3>
              <p className="text-sm text-secondary-500">Julio – octubre 2026</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold text-secondary-900 tabular-nums">{totalBookings}</p>
              <p className="text-sm text-secondary-500">reservas en total</p>
            </div>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBookings} margin={{ top: 24, right: 8, left: -12, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tickLine={false} axisLine={false} tick={{ fill: AXIS_TEXT, fontSize: 12 }} dy={8} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: AXIS_TEXT, fontSize: 12 }} width={40} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<MonthTooltip />} />
                <Bar
                  dataKey="reservas"
                  name="Reservas"
                  fill={SERIES_CURRENT}
                  radius={[4, 4, 0, 0]}
                  label={{ position: 'top', fill: '#0f172a', fontSize: 12, fontWeight: 600 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-secondary-900">Estado de reservas</h3>
          <p className="text-sm text-secondary-500">Octubre 2026</p>
          <p className="mt-6 text-4xl font-display font-bold text-secondary-900 tabular-nums">
            {totalStatus.toLocaleString('es-CO')}
          </p>
          <p className="text-sm text-secondary-500">reservas en el mes</p>
          <div className="mt-6 flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Distribución de reservas por estado">
            {bookingStatus.map((s) => (
              <div
                key={s.label}
                title={`${s.label}: ${s.value}`}
                style={{ width: `${(s.value / totalStatus) * 100}%`, backgroundColor: s.color }}
              />
            ))}
          </div>
          <ul className="mt-6 space-y-4">
            {bookingStatus.map(({ label, value, color, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="text-secondary-700">{label}</span>
                <span className="ml-auto font-semibold text-secondary-900 tabular-nums">{value.toLocaleString('es-CO')}</span>
                <span className="w-12 text-right text-secondary-500 tabular-nums">
                  {((value / totalStatus) * 100).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-secondary-900">Reservas por tipo de servicio</h3>
          <p className="text-sm text-secondary-500">Octubre 2026</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByType} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap={10}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="tipo" tickLine={false} axisLine={false} width={96} tick={{ fill: AXIS_TEXT, fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<ChartTooltip />} />
                <Bar
                  dataKey="reservas"
                  name="Reservas"
                  fill={SERIES_CURRENT}
                  radius={[0, 4, 4, 0]}
                  label={{ position: 'right', fill: '#0f172a', fontSize: 12, fontWeight: 600 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="font-display font-semibold text-secondary-900">Destinos más reservados</h3>
          <p className="text-sm text-secondary-500">Octubre 2026</p>
          <ul className="mt-6 space-y-5">
            {topDestinations.map((d, i) => (
              <li key={d.ciudad}>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-secondary-400 tabular-nums">{i + 1}</span>
                  <span className="font-medium text-secondary-800">{d.ciudad}</span>
                  <span className="ml-auto text-secondary-500 tabular-nums">{d.ingresos}</span>
                  <span className="w-10 text-right font-semibold text-secondary-900 tabular-nums">{d.reservas}</span>
                </div>
                <div className="ml-7 mt-2 h-1.5 rounded-full bg-secondary-100">
                  <div
                    className="h-1.5 rounded-full bg-primary-500"
                    style={{ width: `${(d.reservas / maxDestination) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-secondary-900">Reservas recientes</h3>
            <button
              type="button"
              onClick={() => onNavigate('reservas')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Ver todas
            </button>
          </div>
          <ul className="mt-4 divide-y divide-secondary-100">
            {recentBookings.map((b) => (
              <li key={b.cliente} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                  {b.cliente.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-secondary-900">{b.cliente}</p>
                  <p className="truncate text-xs text-secondary-500">{b.servicio} · {b.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-secondary-900 tabular-nums">{b.monto}</p>
                  <Badge variant={statusVariant[b.estado]}>{b.estado}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};
