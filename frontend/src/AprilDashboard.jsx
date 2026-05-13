import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Activity, Zap, Layers, Cpu, Factory } from 'lucide-react';

const aprilFilingData = [
  { date: 'Apr 2026', actual: 874, target: 872, lsl: 860, usl: 880 },
];

const aprilPastingData = [
  { date: 'Apr 2026', actual: 614, target: 615, lsl: 603, usl: 623 },
];

const aprilGridCastingData = [
  { date: 'Apr 2026', actual: 125.9, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 96.4 },
];

const aprilChargingData = [
  { date: 'Apr 2026', actual: 15.2, target: 15.0, lsl: 14.5, usl: 15.7, current: 15.1 },
];

const complianceCards = [
  { label: 'Filing deviation', value: '+2 g', status: 'On target', icon: <Layers size={18} color="#60a5fa" /> },
  { label: 'Pasting deviation', value: '-1 g', status: 'Minor trim', icon: <Activity size={18} color="#34d399" /> },
  { label: 'Casting variance', value: '+0.4 g', status: 'Stable', icon: <Cpu size={18} color="#f97316" /> },
  { label: 'Charge pulse', value: '+0.2 V', status: 'Nominal', icon: <Zap size={18} color="#c084fc" /> },
];

const ChartPanel = ({ title, subtitle, icon, accent, data, yAxisLabel, yMin, yMax, lines, secondaryAxis = false, rightDomain = [80, 100] }) => (
  <div style={{
    background: 'rgba(15,23,42,0.65)',
    backdropFilter: 'blur(18px)',
    borderRadius: '18px',
    border: `1px solid ${accent}33`,
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '260px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ width: '32px', height: '32px', borderRadius: '12px', display: 'grid', placeItems: 'center', background: accent }}>
            {icon}
          </span>
          <div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{title}</p>
            <h3 style={{ margin: '6px 0 0', fontSize: '16px', fontWeight: 800, color: '#fff' }}>{subtitle}</h3>
          </div>
        </div>
      </div>
      <div style={{ color: accent, fontWeight: 700, fontSize: '11px', letterSpacing: '0.16em' }}>APRIL</div>
    </div>
    <div style={{ flex: 1, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 20, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2a3d" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis domain={[yMin, yMax]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} unit={yAxisLabel} />
          {secondaryAxis && (
            <YAxis yAxisId="right" orientation="right" domain={rightDomain} stroke="#4ade80" tick={{ fill: '#4ade80', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
          )}
          <Tooltip cursor={{ stroke: '#334155', strokeWidth: 1, fill: '#020617', opacity: 0.35 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#e2e8f0', fontSize: '11px' }} />
          <Legend verticalAlign="top" height={28} wrapperStyle={{ paddingBottom: '6px' }} />
          <ReferenceLine y={data[0].lsl} stroke="#f59e0b" strokeDasharray="6 4" label={{ position: 'insideTopLeft', value: 'LSL', fill: '#f59e0b', fontSize: 10, fontWeight: 700 }} />
          <ReferenceLine y={data[0].target} stroke="#60a5fa" strokeDasharray="3 3" label={{ position: 'insideTop', value: 'TARGET', fill: '#60a5fa', fontSize: 10, fontWeight: 700 }} />
          <ReferenceLine y={data[0].usl} stroke="#ef4444" strokeDasharray="6 4" label={{ position: 'insideBottomLeft', value: 'USL', fill: '#ef4444', fontSize: 10, fontWeight: 700 }} />
          {lines.map((line) => (
            <Line key={line.dataKey} {...line} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AprilDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '24px 24px 40px', background: 'linear-gradient(180deg, #040810 0%, #09101f 45%, #070b14 100%)', color: '#e2e8f0', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(96,165,250,0.16)', display: 'grid', placeItems: 'center' }}>
            <Factory size={22} color="#60a5fa" />
          </div>
          <div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>COMPLIANCE SNAPSHOT</p>
            <h1 style={{ margin: '8px 0 0', fontSize: '2rem', lineHeight: 1.05, fontWeight: 900, color: '#ffffff' }}>April 2026 Process Control Analytics</h1>
          </div>
        </div>
        <p style={{ margin: 0, maxWidth: '720px', color: '#cbd5e1', fontSize: '13px', lineHeight: 1.7 }}>
          This single-month analytical view maps April performance across the four core metrics. Each chart reflects the actual process value against the defined target and control limits, providing a concise compliance review for experts.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {complianceCards.map((card) => (
          <div key={card.label} style={{ padding: '22px', borderRadius: '18px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span>{card.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.2em', textTransform: 'uppercase' }}>April</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{card.label}</div>
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.status}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <ChartPanel
          title="Grid Filing"
          subtitle="Filing actual vs. target"
          icon={<Layers size={18} color="#60a5fa" />}
          accent="rgba(96,165,250,0.18)"
          data={aprilFilingData}
          yAxisLabel="g"
          yMin={858}
          yMax={884}
          lines={[
            { type: 'monotone', dataKey: 'actual', stroke: '#38bdf8', strokeWidth: 3, dot: { r: 5 }, name: 'Actual Wt' },
          ]}
        />
        <ChartPanel
          title="Pasting Weight"
          subtitle="Pasting actual vs. spec"
          icon={<Activity size={18} color="#34d399" />}
          accent="rgba(52,211,153,0.16)"
          data={aprilPastingData}
          yAxisLabel="g"
          yMin={596}
          yMax={627}
          lines={[
            { type: 'monotone', dataKey: 'actual', stroke: '#34d399', strokeWidth: 3, dot: { r: 5 }, name: 'Actual Wt' },
          ]}
        />
        <ChartPanel
          title="Grid Casting"
          subtitle="Casting weight and pass rate"
          icon={<Cpu size={18} color="#f97316" />}
          accent="rgba(249,115,22,0.16)"
          data={aprilGridCastingData}
          yAxisLabel="g"
          yMin={124}
          yMax={128}
          secondaryAxis={true}
          rightDomain={[92, 100]}
          lines={[
            { type: 'monotone', dataKey: 'actual', stroke: '#38bdf8', strokeWidth: 3, dot: { r: 5 }, name: 'Grid Wt' },
            { type: 'monotone', dataKey: 'passRate', yAxisId: 'right', stroke: '#4ade80', strokeWidth: 2, dot: false, name: 'Pass Rate (%)' },
          ]}
        />
        <ChartPanel
          title="Charging Telemetry"
          subtitle="Voltage compliance overview"
          icon={<Zap size={18} color="#c084fc" />}
          accent="rgba(192,132,252,0.16)"
          data={aprilChargingData}
          yAxisLabel="V"
          yMin={14}
          yMax={16}
          lines={[
            { type: 'monotone', dataKey: 'actual', stroke: '#a855f7', strokeWidth: 3, dot: { r: 5 }, name: 'Voltage (V)' },
            { type: 'monotone', dataKey: 'current', stroke: '#f472b6', strokeWidth: 2, dot: false, name: 'Current (A)' },
          ]}
        />
      </div>
    </div>
  );
};

export default AprilDashboard;
