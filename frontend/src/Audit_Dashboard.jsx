import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Layers, Cpu, Factory } from 'lucide-react';

// Analyst-grade process telemetry with defined target, lower spec, and upper spec
const filingData = [
  { date: 'Nov 2025', actual: 875, target: 872, lsl: 860, usl: 880 },
  { date: 'Dec 2025', actual: 871, target: 872, lsl: 860, usl: 880 },
  { date: 'Jan 2026', actual: 882, target: 872, lsl: 860, usl: 880 },
  { date: 'Feb 2026', actual: 869, target: 872, lsl: 860, usl: 880 },
  { date: 'Mar 2026', actual: 858, target: 872, lsl: 860, usl: 880 },
  { date: 'Apr 2026', actual: 874, target: 872, lsl: 860, usl: 880 },
];

const pastingData = [
  { date: 'Nov 2025', actual: 615, target: 615, lsl: 603, usl: 623 },
  { date: 'Dec 2025', actual: 624, target: 615, lsl: 603, usl: 623 },
  { date: 'Jan 2026', actual: 612, target: 615, lsl: 603, usl: 623 },
  { date: 'Feb 2026', actual: 620, target: 615, lsl: 603, usl: 623 },
  { date: 'Mar 2026', actual: 616, target: 615, lsl: 603, usl: 623 },
  { date: 'Apr 2026', actual: 614, target: 615, lsl: 603, usl: 623 },
];

const gridCastingData = [
  { date: 'Nov 2025', actual: 125.3, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 97.5 },
  { date: 'Dec 2025', actual: 125.7, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 94.8 },
  { date: 'Jan 2026', actual: 127.2, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 98.2 },
  { date: 'Feb 2026', actual: 124.9, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 99.3 },
  { date: 'Mar 2026', actual: 125.4, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 95.7 },
  { date: 'Apr 2026', actual: 125.9, target: 125.5, lsl: 124.4, usl: 126.8, passRate: 96.4 },
];

const chargingData = [
  { date: 'Nov 2025', actual: 14.8, target: 15.0, lsl: 14.5, usl: 15.7, current: 15.2 },
  { date: 'Dec 2025', actual: 15.1, target: 15.0, lsl: 14.5, usl: 15.7, current: 14.9 },
  { date: 'Jan 2026', actual: 14.3, target: 15.0, lsl: 14.5, usl: 15.7, current: 15.6 },
  { date: 'Feb 2026', actual: 15.3, target: 15.0, lsl: 14.5, usl: 15.7, current: 14.7 },
  { date: 'Mar 2026', actual: 15.0, target: 15.0, lsl: 14.5, usl: 15.7, current: 15.3 },
  { date: 'Apr 2026', actual: 15.2, target: 15.0, lsl: 14.5, usl: 15.7, current: 15.1 },
];

// Generic visible legend renderer
const VisibleLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '8px' }}>
      {payload && payload.map((entry, index) => {
        if (!entry.value) return null;
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#cbd5e1', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
            {entry.value}
          </div>
        );
      })}
    </div>
  );
};

const ManufacturingDashboard = () => {
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data sync pulsing
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #020617 0%, #0a0f1e 50%, #050b17 100%)',
      padding: '14px 18px',
      color: '#e2e8f0',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* Left: Company + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            borderRadius: '8px',
            padding: '7px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(249,115,22,0.4)',
            flexShrink: 0,
          }}>
            <Factory size={16} color="#000" />
          </div>
          <div>
            <div style={{
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.28em',
              color: '#f97316',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}>
              MEGAMP INDUSTRIES PVT LTD
            </div>
            <h1 style={{
              fontSize: '16px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #34d399, #60a5fa, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase',
              lineHeight: 1,
              margin: 0,
            }}>
              Manufacturing Intelligence Command
            </h1>
            <p style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#64748b',
              textTransform: 'uppercase',
              marginTop: '3px',
              margin: '3px 0 0 0',
            }}>
              Real-time Telemetry &nbsp;•&nbsp; Digital Twin Sync &nbsp;•&nbsp; v4.1.0
            </p>
          </div>
        </div>

        {/* Right: Live badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.18)',
          borderRadius: '8px',
          padding: '6px 14px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isLive ? '#10b981' : '#475569',
            boxShadow: isLive ? '0 0 8px #10b981' : 'none',
            transition: 'all 0.3s ease',
          }} />
          <span style={{
            fontSize: '9px',
            fontWeight: 800,
            color: '#34d399',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Live Sync
          </span>
        </div>
      </div>

      {/* ── 2×2 CHART GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '12px',
        flex: 1,
        minHeight: 0,
      }}>

        {/* 1. Grid Casting Performance */}
        <div style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(16px)',
          borderRadius: '14px',
          border: '1px solid rgba(249,115,22,0.15)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s',
        }}>
          <div style={{ marginBottom: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={11} color="#f97316" />
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
              01. Grid Casting Performance
            </h2>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gridCastingData} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} domain={[124, 127]} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{ fill: '#4ade80', fontSize: 9, fontWeight: 600 }} domain={[90, 100]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#334155', strokeWidth: 1, fill: '#020617', opacity: 0.3 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }} />
                <Legend content={<VisibleLegend />} />
                <Line type="monotone" dataKey="lsl" stroke="#f59e0b" strokeDasharray="6 4" strokeWidth={2} dot={false} opacity={0.95} name="LSL" />
                <Line type="monotone" dataKey="target" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth={2.5} dot={false} opacity={0.95} name="Target" />
                <Line type="monotone" dataKey="usl" stroke="#ef4444" strokeDasharray="6 4" strokeWidth={2} dot={false} opacity={0.95} name="USL" />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={3} dot={{ r: 2 }} name="Grid Weight (g)" />
                <Line yAxisId="right" type="monotone" dataKey="passRate" stroke="#4ade80" strokeWidth={2} dot={{ r: 2 }} name="Pass Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Grid Filing Variance */}
        <div style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(16px)',
          borderRadius: '14px',
          border: '1px solid rgba(59,130,246,0.15)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s',
        }}>
          <div style={{ marginBottom: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={11} color="#60a5fa" />
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
              02. Grid Filing Variance
            </h2>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filingData} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} domain={[848, 890]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#334155', strokeWidth: 1, fill: '#020617', opacity: 0.3 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }} />
                <Legend content={<VisibleLegend />} />
                <Line type="monotone" dataKey="lsl" stroke="#f59e0b" strokeDasharray="6 4" dot={false} name="LSL" />
                <Line type="monotone" dataKey="target" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth={2} dot={false} name="Target" />
                <Line type="monotone" dataKey="usl" stroke="#ef4444" strokeDasharray="6 4" dot={false} name="USL" />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 2 }} name="Actual Wt" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Pasting Weight Control */}
        <div style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(16px)',
          borderRadius: '14px',
          border: '1px solid rgba(16,185,129,0.15)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s',
        }}>
          <div style={{ marginBottom: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={11} color="#34d399" />
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
              03. Pasting Weight Control
            </h2>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pastingData} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} domain={[596, 630]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#334155', strokeWidth: 1, fill: '#020617', opacity: 0.3 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }} />
                <Legend content={<VisibleLegend />} />
                <Line type="monotone" dataKey="lsl" stroke="#f59e0b" strokeDasharray="6 4" dot={false} name="LSL" />
                <Line type="monotone" dataKey="target" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth={2} dot={false} name="Target" />
                <Line type="monotone" dataKey="usl" stroke="#ef4444" strokeDasharray="6 4" dot={false} name="USL" />
                <Line type="monotone" dataKey="actual" stroke="#34d399" strokeWidth={2.5} dot={{ r: 2 }} name="Pasted Wt" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Charging Telemetry */}
        <div style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(16px)',
          borderRadius: '14px',
          border: '1px solid rgba(168,85,247,0.15)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s',
        }}>
          <div style={{ marginBottom: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={11} color="#c084fc" />
            <h2 style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', margin: 0 }}>
              04. Charging Telemetry (V/I)
            </h2>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chargingData} margin={{ top: 4, right: 16, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} domain={[14.2, 15.9]} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{ fill: '#f472b6', fontSize: 9, fontWeight: 600 }} domain={[14, 16]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ stroke: '#334155', strokeWidth: 1, fill: '#020617', opacity: 0.3 }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }} />
                <Legend content={<VisibleLegend />} />
                <Line yAxisId="left" type="monotone" dataKey="lsl" stroke="#f59e0b" strokeDasharray="6 4" dot={false} name="LSL" />
                <Line yAxisId="left" type="monotone" dataKey="target" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth={2} dot={false} name="Target" />
                <Line yAxisId="left" type="monotone" dataKey="usl" stroke="#ef4444" strokeDasharray="6 4" dot={false} name="USL" />
                <Line yAxisId="left" type="monotone" dataKey="actual" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 2 }} name="Voltage (V)" />
                <Line yAxisId="right" type="monotone" dataKey="current" stroke="#f472b6" strokeWidth={2} dot={{ r: 2 }} name="Current (A)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManufacturingDashboard;
