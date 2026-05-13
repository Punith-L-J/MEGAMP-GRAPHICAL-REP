import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';
import { Activity, Zap, Layers, Cpu, Factory } from 'lucide-react';


// Simulated telemetry data for the last 6 months based on our single source of truth
const filingData = [
  { date: 'Nov 2025', actual: 875, lsl: 860, usl: 880 },
  { date: 'Dec 2025', actual: 872, lsl: 860, usl: 880 },
  { date: 'Jan 2026', actual: 878, lsl: 860, usl: 880 },
  { date: 'Feb 2026', actual: 870, lsl: 860, usl: 880 },
  { date: 'Mar 2026', actual: 868, lsl: 860, usl: 880 },
  { date: 'Apr 2026', actual: 874, lsl: 860, usl: 880 },
];

const pastingData = [
  { date: 'Nov 2025', actual: 615, lsl: 603, usl: 623 },
  { date: 'Dec 2025', actual: 618, lsl: 603, usl: 623 },
  { date: 'Jan 2026', actual: 612, lsl: 603, usl: 623 },
  { date: 'Feb 2026', actual: 620, lsl: 603, usl: 623 },
  { date: 'Mar 2026', actual: 617, lsl: 603, usl: 623 },
  { date: 'Apr 2026', actual: 614, lsl: 603, usl: 623 },
];

const gridCastingData = [
  { date: 'Nov 2025', gridWeight: 125.2, passRate: 100.0 },
  { date: 'Dec 2025', gridWeight: 125.5, passRate: 88.2  },
  { date: 'Jan 2026', gridWeight: 125.6, passRate: 90.0  },
  { date: 'Feb 2026', gridWeight: 124.7, passRate: 100.0 },
  { date: 'Mar 2026', gridWeight: 124.5, passRate: 88.5  },
  { date: 'Apr 2026', gridWeight: 126.4, passRate: 84.2  },
];

const chargingData = [
  { date: 'Nov 2025', voltage: 14.8, current: 15.2 },
  { date: 'Dec 2025', voltage: 15.1, current: 14.8 },
  { date: 'Jan 2026', voltage: 14.5, current: 16.0 },
  { date: 'Feb 2026', voltage: 15.3, current: 14.5 },
  { date: 'Mar 2026', voltage: 14.9, current: 15.5 },
  { date: 'Apr 2026', voltage: 15.0, current: 15.0 },
];

// Custom legend renderer for Filing chart — makes all items clearly visible
const FilingLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '6px' }}>
      {payload && payload.map((entry, index) => {
        // Skip empty-name entries (the lsl fill area)
        if (!entry.value) return null;
        let color = entry.color;
        // Give the Spec Band a visible slate-blue color
        if (entry.value === 'Spec Band') color = '#64748b';
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            {entry.value}
          </div>
        );
      })}
    </div>
  );
};

// Generic visible legend renderer
const VisibleLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', paddingTop: '6px' }}>
      {payload && payload.map((entry, index) => {
        if (!entry.value) return null;
        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
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
              <BarChart data={gridCastingData} margin={{ top: 4, right: 40, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                {/* Left axis: Grid Weight */}
                <YAxis yAxisId="left" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} domain={[120, 130]} axisLine={false} tickLine={false} />
                {/* Right axis: Pass Rate % */}
                <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{ fill: '#4ade80', fontSize: 9, fontWeight: 600 }} domain={[80, 105]} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }}
                />
                <Legend content={<VisibleLegend />} />
                <Bar yAxisId="left" dataKey="gridWeight" fill="#f97316" radius={[3, 3, 0, 0]} name="Grid Wt (g)" barSize={22} />
                <Bar yAxisId="right" dataKey="passRate" fill="#4ade80" radius={[3, 3, 0, 0]} name="Pass Rate (%)" barSize={22} fillOpacity={0.8} />
              </BarChart>
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
              <BarChart data={filingData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[840, 900]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }}
                />
                <Legend content={<VisibleLegend />} />
                <Bar dataKey="usl" name="USL" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} fillOpacity={0.75} />
                <Bar dataKey="actual" name="Actual Wt" fill="#3b82f6" radius={[3, 3, 0, 0]} barSize={14} />
                <Bar dataKey="lsl" name="LSL" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={14} fillOpacity={0.75} />
              </BarChart>
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
              <BarChart data={pastingData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[590, 640]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }}
                />
                <Legend content={<VisibleLegend />} />
                <Bar dataKey="usl" name="USL" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={14} fillOpacity={0.75} />
                <Bar dataKey="actual" name="Pasted Wt" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                <Bar dataKey="lsl" name="LSL" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={14} fillOpacity={0.75} />
              </BarChart>
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
              <BarChart data={chargingData} margin={{ top: 4, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[10, 20]} stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '10px', borderRadius: '8px', color: '#e2e8f0' }}
                />
                <Legend content={<VisibleLegend />} />
                <Bar dataKey="voltage" name="Voltage (V)" fill="#a855f7" radius={[3, 3, 0, 0]} barSize={20} />
                <Bar dataKey="current" name="Current (A)" fill="#f472b6" radius={[3, 3, 0, 0]} barSize={20} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManufacturingDashboard;
