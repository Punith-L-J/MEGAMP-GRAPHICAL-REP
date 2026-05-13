import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Activity, Layers, Cpu, Factory, Calendar, Filter } from 'lucide-react';

const aprilFilingData = [
  { date: 'Week 1', actual: 869, target: 872, lsl: 860, usl: 880 },
  { date: 'Week 2', actual: 872, target: 872, lsl: 860, usl: 880 },
  { date: 'Week 3', actual: 876, target: 872, lsl: 860, usl: 880 },
  { date: 'Week 4', actual: 874, target: 872, lsl: 860, usl: 880 },
];

const aprilPastingData = [
  { date: 'Week 1', actual: 611, target: 615, lsl: 603, usl: 623 },
  { date: 'Week 2', actual: 616, target: 615, lsl: 603, usl: 623 },
  { date: 'Week 3', actual: 618, target: 615, lsl: 603, usl: 623 },
  { date: 'Week 4', actual: 614, target: 615, lsl: 603, usl: 623 },
];

const aprilGridCastingData = [
  { date: 'Week 1', actual: 125.2, target: 125.5, lsl: 124.4, usl: 126.8 },
  { date: 'Week 2', actual: 125.6, target: 125.5, lsl: 124.4, usl: 126.8 },
  { date: 'Week 3', actual: 126.0, target: 125.5, lsl: 124.4, usl: 126.8 },
  { date: 'Week 4', actual: 125.9, target: 125.5, lsl: 124.4, usl: 126.8 },
];

const aprilSpineCastingData = [
  { date: 'Week 1', actual: 87.3, target: 87.5, lsl: 86.2, usl: 88.8 },
  { date: 'Week 2', actual: 87.6, target: 87.5, lsl: 86.2, usl: 88.8 },
  { date: 'Week 3', actual: 87.1, target: 87.5, lsl: 86.2, usl: 88.8 },
  { date: 'Week 4', actual: 87.4, target: 87.5, lsl: 86.2, usl: 88.8 },
];

const sectionsList = ['Grid Casting', 'Spine Casting', 'Filing', 'Pasting'];

const complianceCards = [
  { label: 'Filing deviation', value: '+2 g', status: 'On target', icon: <Layers size={18} color="#60a5fa" /> },
  { label: 'Pasting deviation', value: '-1 g', status: 'Minor trim', icon: <Activity size={18} color="#34d399" /> },
  { label: 'Casting variance', value: '+0.4 g', status: 'Stable', icon: <Cpu size={18} color="#f97316" /> },
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
  const [selectedDates, setSelectedDates] = useState(['Week 1', 'Week 2', 'Week 3', 'Week 4']);
  const [selectedSections, setSelectedSections] = useState(['Grid Casting', 'Filing', 'Pasting']);

  // Filter data based on selections
  const filterData = (data) => {
    return data.filter(item => selectedDates.includes(item.date));
  };

  const filteredFilingData = filterData(aprilFilingData);
  const filteredPastingData = filterData(aprilPastingData);
  const filteredGridCastingData = filterData(aprilGridCastingData);
  const filteredSpineCastingData = filterData(aprilSpineCastingData);

  const handleDateChange = (date) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleSectionChange = (section) => {
    setSelectedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
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

      {/* Filter Section */}
      <div style={{
        background: 'rgba(15,23,42,0.65)',
        backdropFilter: 'blur(18px)',
        borderRadius: '18px',
        border: '1px solid rgba(96,165,250,0.18)',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Filter size={18} color="#60a5fa" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#fff' }}>Filter Data</h3>
        </div>

        {/* Date Filter */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: '0 0 12px 0', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Select Dates
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((date) => (
              <button
                key={date}
                onClick={() => handleDateChange(date)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: selectedDates.includes(date) ? '2px solid #60a5fa' : '1px solid rgba(148,163,184,0.2)',
                  background: selectedDates.includes(date) ? 'rgba(96,165,250,0.2)' : 'rgba(30,41,59,0.4)',
                  color: selectedDates.includes(date) ? '#60a5fa' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Section Filter */}
        <div>
          <p style={{ margin: '0 0 12px 0', color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Select Sections
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sectionsList.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionChange(section)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: selectedSections.includes(section) ? '2px solid #34d399' : '1px solid rgba(148,163,184,0.2)',
                  background: selectedSections.includes(section) ? 'rgba(52,211,153,0.2)' : 'rgba(30,41,59,0.4)',
                  color: selectedSections.includes(section) ? '#34d399' : '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts - Reordered: Grid Casting, Spine Casting, Filing, Pasting */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        {selectedSections.includes('Grid Casting') && (
          <ChartPanel
            title="Grid Casting"
            subtitle="Casting weight performance"
            icon={<Cpu size={18} color="#f97316" />}
            accent="rgba(249,115,22,0.16)"
            data={filteredGridCastingData}
            yAxisLabel="g"
            yMin={124}
            yMax={128}
            lines={[
              { type: 'monotone', dataKey: 'actual', stroke: '#38bdf8', strokeWidth: 3, dot: { r: 5 }, name: 'Grid Wt' },
            ]}
          />
        )}

        {selectedSections.includes('Spine Casting') && (
          <ChartPanel
            title="Spine Casting"
            subtitle="Spine casting weight performance"
            icon={<Cpu size={18} color="#a855f7" />}
            accent="rgba(168,85,247,0.16)"
            data={filteredSpineCastingData}
            yAxisLabel="g"
            yMin={85}
            yMax={90}
            lines={[
              { type: 'monotone', dataKey: 'actual', stroke: '#a855f7', strokeWidth: 3, dot: { r: 5 }, name: 'Spine Wt' },
            ]}
          />
        )}

        {selectedSections.includes('Filing') && (
          <ChartPanel
            title="Grid Filing"
            subtitle="Filing actual vs. target"
            icon={<Layers size={18} color="#60a5fa" />}
            accent="rgba(96,165,250,0.18)"
            data={filteredFilingData}
            yAxisLabel="g"
            yMin={858}
            yMax={884}
            lines={[
              { type: 'monotone', dataKey: 'actual', stroke: '#38bdf8', strokeWidth: 3, dot: { r: 5 }, name: 'Actual Wt' },
            ]}
          />
        )}

        {selectedSections.includes('Pasting') && (
          <ChartPanel
            title="Pasting Weight"
            subtitle="Pasting actual vs. spec"
            icon={<Activity size={18} color="#34d399" />}
            accent="rgba(52,211,153,0.16)"
            data={filteredPastingData}
            yAxisLabel="g"
            yMin={596}
            yMax={627}
            lines={[
              { type: 'monotone', dataKey: 'actual', stroke: '#34d399', strokeWidth: 3, dot: { r: 5 }, name: 'Actual Wt' },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default AprilDashboard;
