import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, Truck, Activity, FlaskConical, BarChart3, User, ShieldCheck, 
  ChevronRight, Cpu, Layers, Radio, LogIn, Lock, Database, Clock, 
  Settings, AlertTriangle, CheckCircle2, Factory, Terminal, BatteryCharging,
  Upload, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AprilDashboard from './AprilDashboard.jsx';
import ManufacturingDashboard from './Audit_Dashboard.jsx';

const API_BASE_URL = 'http://localhost:8000/api';

// --- COMPONENTS ---

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="breadcrumbs" aria-label="Breadcrumbs">
      <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>
        <Factory size={14} style={{ marginRight: '8px' }} />
        ROOT
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <React.Fragment key={to}>
            <span className="breadcrumb-separator">/</span>
            <Link
              to={to}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              {value.toUpperCase()}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const SectionCard = ({ title, children, accent = 'var(--primary)' }) => {
  return (
    <section className="glass-panel" style={{ padding: '32px', borderLeft: `4px solid ${accent}` }}>
      <h3 className="section-label" style={{ marginBottom: '24px' }}>{title}</h3>
      {children}
    </section>
  );
};

const KpiCard = ({ label, value, icon, colorVar = 'var(--primary)', footerText }) => {
  return (
    <div className="glass-panel kpi-card" aria-label={label} style={{ padding: '24px', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="kpi-label" style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: '800', color: 'var(--text-dim)' }}>{label}</span>
        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          {icon}
        </div>
      </div>
      <div className="kpi-value mono" style={{ fontSize: '2rem', fontWeight: '900', color: colorVar, textShadow: `0 0 20px ${colorVar}40` }}>{value}</div>
      {footerText && <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '12px', letterSpacing: '0.05em', fontWeight: '600' }}>{footerText}</div>}
    </div>
  );
};

const StatusPill = ({ variant = 'active', children, style = {} }) => {
  return (
    <div className={`status-badge ${variant}`} style={style}>
      {children}
    </div>
  );
};


const Layout = ({ children, notifications }) => {
  return (
    <div className="app-container">
      {/* GLOBAL NOTIFICATIONS */}
      <div style={{ position: 'fixed', top: '32px', right: '32px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id} 
              initial={{ x: 100, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: 100, opacity: 0 }}
              style={{ 
                background: 'rgba(10,10,12,0.98)', 
                borderLeft: `4px solid ${n.type === 'error' ? 'var(--error)' : 'var(--primary)'}`,
                padding: '20px 28px',
                minWidth: '340px',
                backdropFilter: 'blur(30px)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                borderTop: '1px solid var(--border)',
                borderRadius: '12px'
              }}
            >
              <div style={{ 
                background: n.type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(255, 87, 34, 0.1)', 
                padding: '10px', 
                borderRadius: '8px' 
              }}>
                <AlertTriangle size={20} color={n.type === 'error' ? 'var(--error)' : 'var(--primary)'} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)' }}>{n.title}</div>
                <div style={{ fontSize: '13px', color: '#fff', marginTop: '4px', fontWeight: '500' }}>{n.message}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <nav className="nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #FF7043 100%)', 
              padding: '8px', 
              borderRadius: '8px',
              boxShadow: '0 0 20px var(--primary-glow)'
            }}>
              <Zap size={24} color="#000" fill="#000" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '900', letterSpacing: '-0.02em' }}>MEGAMP <span style={{ color: 'var(--primary)' }}>BATTERIES</span></h2>
              <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.4em', fontWeight: '900' }}>POWERED BY RELIABLE BATTERY PERFORMANCE</div>
            </div>
          </Link>
          <Breadcrumbs />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="status-badge status-active" style={{ background: 'rgba(0, 255, 148, 0.05)', border: '1px solid rgba(0, 255, 148, 0.2)' }}>
            <div className="dot"></div>
            <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--success)', letterSpacing: '0.1em' }}>SYSTEM NOMINAL</span>
          </div>
          <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-industrial" style={{ padding: '10px 24px', fontSize: '11px' }}>
              <ShieldCheck size={16} />
              BATTERY PORTAL
            </button>
          </Link>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '16px' }}>
          <span>NODE: SG-01</span>
          <span>UPTIME: 99.98%</span>
          <span>LATENCY: 12ms</span>
        </div>
        © 2026 MEGAMP INDUSTRIES INFRASTRUCTURE v4.0 | SECURE CONNECTION
      </footer>
    </div>
  );
};

// --- PAGES ---

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '450px', margin: '100px auto', width: '100%' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px var(--primary-glow)'
          }}>
            <ShieldCheck size={32} color="#000" />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Authorized Access</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '12px', letterSpacing: '0.1em' }}>BATTERY COMMAND PORTAL</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/'); }}>
          <div style={{ marginBottom: '24px' }}>
            <label>Employee ID</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="input-field" placeholder="MIP-XXXX" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label>Access Key</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="input-field" type="password" placeholder="••••••••" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <button className="btn-industrial w-full" style={{ width: '100%' }}>
            <Radio size={18} />
            Initialize Session
          </button>
        </form>

        <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            BY PROCEEDING, YOU AGREE TO BATTERY COMPLIANCE PROTOCOLS
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    uptime: '99.98%',
    activeProcesses: 12,
    pendingAlerts: 0,
    syncStatus: 'REAL-TIME'
  });
  const [activities, setActivities] = useState([
    { time: '10:42 AM', msg: 'Ingress node SG-01 authenticated new material batch', type: 'info' },
    { time: '10:15 AM', msg: 'Spine casting cycle #42 completed successfully', type: 'success' },
    { time: '09:30 AM', msg: 'System wide calibration check finished', type: 'info' }
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/metrics`);
        if (res.data) setMetrics(res.data);
      } catch (error) {
        console.warn("Using fallback metrics, API unavailable:", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/activities`);
        if (res.data) setActivities(res.data);
      } catch (error) {
        console.warn("Using fallback activities, API unavailable:", error);
      }
    };

    fetchMetrics(); // Initial fetch
    fetchActivities();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchActivities();
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Intercept successful upload navigation redirects and update Dashboard logs
  useEffect(() => {
    if (location.state?.newUpload) {
      setMetrics(prev => ({ ...prev, syncStatus: 'JUST SYNCED' }));
      navigate('.', { replace: true, state: {} }); // Clear router state so it doesn't duplicate on reload
    }
  }, [location.state, navigate]);

  const modules = [
    { path: '/ingress', title: 'Raw Materials', icon: <Truck size={24} />, desc: 'Battery-grade material intake' },
    { path: '/process', title: 'Battery Process', icon: <Activity size={24} />, desc: 'Manufacturing process control' },
    { path: '/lab', title: 'Quality Lab', icon: <FlaskConical size={24} />, desc: 'Battery validation & reliability tests' },
    { path: '/insights', title: 'Production Insights', icon: <BarChart3 size={24} />, desc: 'Yield and cycle analytics' },
    { path: '/upload', title: 'Data Bridge', icon: <Upload size={24} />, desc: 'Secure data migration and audit' },
    { path: '/april', title: 'April Analytics', icon: <Calendar size={24} />, desc: 'April 2026 Process Control Analytics' },
    { path: '/audit', title: 'Mfg Audit', icon: <Factory size={24} />, desc: 'Manufacturing Intelligence Command' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <header className="glass-panel" style={{ padding: '60px 40px', position: 'relative', overflow: 'hidden', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(255, 87, 34, 0.15) 0%, transparent 70%)', transform: 'rotate(-15deg)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Zap size={20} color="var(--primary)" />
            <span className="section-label" style={{ margin: 0 }}>INNOVATIVE BATTERY TECHNOLOGY</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
            UNLEASH THE MAGIC OF<br />
            <span style={{ color: 'var(--primary)' }}>UNINTERRUPTED DURABILITY</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: '600px', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
            Experience unmatched reliability with Megamp Batteries. Our cutting-edge manufacturing intelligence keeps power stable across automotive, solar, and industrial applications.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>THICK & TOUGH GRID DESIGN</div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>ISO CERTIFIED RELIABILITY</div>
            <div className="status-badge" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>POWER BACKUP OPTIMIZED</div>
          </div>
        </div>
      </header>

      {/* System Status KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="SYSTEM UPTIME" value={metrics.uptime} icon={<Activity size={18} color="var(--primary)" />} colorVar="var(--primary)" footerText="LAST 30 DAYS" />
        <KpiCard label="ACTIVE PROCESSES" value={metrics.activeProcesses} icon={<Settings size={18} color="var(--success)" />} colorVar="var(--success)" footerText="OPTIMAL LOAD" />
        <KpiCard label="PENDING ALERTS" value={metrics.pendingAlerts} icon={<AlertTriangle size={18} color="var(--text-dim)" />} colorVar="var(--text-dim)" footerText={metrics.pendingAlerts > 0 ? "ATTENTION REQUIRED" : "ALL SYSTEMS NOMINAL"} />
        <KpiCard label="DATA SYNC" value={metrics.syncStatus} icon={<Database size={18} color="var(--accent)" />} colorVar="var(--accent)" footerText="LATENCY: 12ms" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {modules.map((m, i) => (
          <Link key={m.path} to={m.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(255, 87, 34, 0.15)', borderColor: 'var(--primary)' }}
              className="glass-card" 
              style={{ padding: '24px', height: '100%', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.3s ease', background: 'rgba(10,10,12,0.6)', borderRadius: '16px' }}
            >
              <div style={{ color: 'var(--primary)', background: 'rgba(255, 87, 34, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: '800' }}>{m.title}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '11px', letterSpacing: '0.05em', lineHeight: '1.5' }}>{m.desc}</p>
              </div>
              <div style={{ alignSelf: 'flex-end', color: 'var(--primary)', background: 'rgba(255, 87, 34, 0.1)', padding: '6px', borderRadius: '50%', marginTop: '16px' }}>
                <ChevronRight size={16} />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Activity / Quick Status */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 className="section-label" style={{ margin: 0 }}>RECENT SYSTEM ACTIVITY</h3>
          <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>LIVE LOG</div>
        </div>
        <div className="space-y-4">
            {activities.map((log, i) => {
              const isUpload = log.type === 'upload';
              const isSuccess = log.type === 'success';
              const logColor = isUpload ? '#00F2FF' : isSuccess ? 'var(--success)' : 'var(--primary)';
              const logBg = isUpload ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.02)';
              const logBorder = isUpload ? '1px solid rgba(0, 242, 255, 0.2)' : '1px solid transparent';
              
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: logBg, borderRadius: '8px', border: logBorder }}>
                <div className="mono" style={{ fontSize: '12px', color: 'var(--text-dim)', width: '80px' }}>{log.time}</div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: logColor, boxShadow: `0 0 10px ${logColor}` }}></div>
                  <div style={{ fontSize: '13px', color: isUpload ? '#00F2FF' : '#fff', fontWeight: isUpload ? '700' : '500' }}>{log.msg}</div>
              </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, ScatterChart, Scatter, PieChart, Pie, Cell, Legend,
  ReferenceLine, ComposedChart
} from 'recharts';

const COLORS = ['#FF5722', '#00F2FF', '#00FF94', '#FFC107', '#E91E63'];

const IngressPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('grey_oxide');
  const [selectedSample, setSelectedSample] = useState('Sample-1');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedHistory, setVerifiedHistory] = useState([
    { id: 'V-991', category: 'Grey Oxide', sample: 'S-88', date: '4-5-26', time: '09:42 AM', results: [{label: 'Purity', value: 99.8, unit: '%', passed: true}, {label: 'AD', value: 1.34, unit: 'g/cc', passed: true}], status: 'PASS' },
  ]);
  
  const CATEGORY_SPECS = {
    grey_oxide: [
      { key: 'freeLead', label: 'Free Metallic Lead', spec: '29%-32%', range: [29, 32], unit: '%' },
      { key: 'leadOxide', label: 'Lead Oxide as PB%', spec: '68%-70%', range: [68, 70], unit: '' },
      { key: 'waterAbsorption', label: 'Water Absorption', spec: '10-12 ml/100', range: [10, 12], unit: '' },
      { key: 'ad', label: 'Apparent Density(AD)', spec: '1.32-1.38 gm/cc', range: [1.32, 1.38], unit: ' gm/cc' },
      { key: 'mesh100', label: '100 Mesh', spec: '92-98%', range: [92, 98], unit: '%' },
      { key: 'moisture', label: 'Moisture', spec: '< 0.5%', range: [0, 0.5], unit: '%' },
      { key: 'chlorine', label: 'Chlorine', spec: '0.0002%', range: [0, 0.0002], unit: '%' },
      { key: 'iron', label: 'Iron', spec: '0.0001%', range: [0, 0.0001], unit: '%' },
    ],
    red_oxide: [
      { key: 'freeLead', label: 'Free Metallic Lead', spec: '29%-32%', range: [29, 32], unit: '%' },
      { key: 'leadOxide', label: 'Lead Oxide as PB%', spec: '68%-70%', range: [68, 70], unit: '' },
      { key: 'ad', label: 'Apparent Density(AD)', spec: '1.32-1.38 gm/cc', range: [1.32, 1.38], unit: ' gm/cc' },
    ],
    pe_separator: [
      { key: 'porosity', label: 'Porosity', spec: '60%-80%', range: [60, 80], unit: '%' },
      { key: 'resistance', label: 'Electrical Resistance', spec: '< 100 mΩ-cm²', range: [0, 100], unit: ' mΩ-cm²' },
      { key: 'deoxidation', label: 'De-Oxidation Level', spec: 'Certified', range: [1, 1], unit: '' },
    ],
    tubular_bag: [
      { key: 'acidResistance', label: 'Acid Resistance', spec: 'High', range: [1, 1], unit: '' },
      { key: 'oxidation', label: 'Oxidation Resistance', spec: 'Certified', range: [1, 1], unit: '' },
      { key: 'porosity', label: 'Porosity', spec: '80%-90%', range: [80, 90], unit: '%' },
    ],
    dm_water: [
      { key: 'tds', label: 'TDS Level', spec: '< 10', range: [0, 10], unit: ' ppm' },
      { key: 'iron', label: 'Iron Content', spec: 'Nil', range: [0, 0.001], unit: ' ppm' },
      { key: 'chlorine', label: 'Chlorine Content', spec: 'Nil', range: [0, 0.001], unit: ' ppm' },
    ],
    sulfuric_acid: [
      { key: 'acidPerc', label: 'Percentage of Acid', spec: '98%', range: [97, 99], unit: '%' },
      { key: 'spGravity', label: 'Specific Gravity', spec: '1.835-1.845', range: [1.835, 1.845], unit: '' },
      { key: 'chloride', label: 'Chloride Content', spec: '< 10 ppm', range: [0, 10], unit: ' ppm' },
    ]
  };

  const [qcData, setQcData] = useState({
    freeLead: 31.45, leadOxide: 68.6, waterAbsorption: 11.21, ad: 1.302,
    mesh100: 97.6, moisture: 0.09, chlorine: 0.0002, iron: 0.0001,
    porosity: 72, resistance: 85, deoxidation: 1, acidResistance: 1,
    oxidation: 1, tds: 5, acidPerc: 98.2, spGravity: 1.84, chloride: 4
  });

  const materialCategories = [
    { id: 'grey_oxide', name: 'Grey Oxide', icon: <Cpu size={18} /> },
    { id: 'red_oxide', name: 'Red Oxide', icon: <Cpu size={18} /> },
    { id: 'pe_separator', name: 'PE Separator', icon: <Layers size={18} /> },
    { id: 'tubular_bag', name: 'Tubular Bag/Gauntlet', icon: <Layers size={18} /> },
    { id: 'dm_water', name: 'DM Water', icon: <FlaskConical size={18} /> },
    { id: 'sulfuric_acid', name: 'Sulfuric Acid', icon: <FlaskConical size={18} /> },
  ];

  const checkPass = (val, range) => {
    return val >= range[0] && val <= range[1];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQcData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const trendData = [
    { sample: 'S1', ad: 1.302, lead: 68.6 },
    { sample: 'S2', ad: 1.203, lead: 68.76 },
    { sample: 'S3', ad: 1.35, lead: 69.2 },
    { sample: 'S4', ad: 1.33, lead: 69.1 },
    { sample: 'S5', ad: 1.36, lead: 69.5 },
    { sample: 'S6', ad: 1.32, lead: 68.2 },
    { sample: 'S7', ad: 1.34, lead: 69.4 },
    { sample: 'S8', ad: 1.37, lead: 69.9 },
    { sample: 'S9', ad: 1.31, lead: 67.8 },
    { sample: 'S10', ad: 1.34, lead: 69.2 },
  ];

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const currentSpecs = CATEGORY_SPECS[selectedCategory];
      const resultsSummary = currentSpecs.map(s => ({
        label: s.label,
        value: qcData[s.key],
        unit: s.unit,
        passed: checkPass(qcData[s.key], s.range)
      }));

      const newEntry = {
        id: `V-${Math.floor(Math.random() * 10000)}`,
        category: selectedCategory.replace('_', ' ').toUpperCase(),
        sample: selectedSample,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        results: resultsSummary,
        status: resultsSummary.every(r => r.passed) ? 'PASS' : 'FAIL'
      };
      setVerifiedHistory(prev => [newEntry, ...prev]);
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="cyber-header">
        <div>
          <span className="section-label">BATTERY PERFORMANCE DATA</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>MATERIAL <span style={{ color: 'var(--primary)' }}>INGRESS</span></h1>
        </div>
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>ENCRYPTION: AES-256</div>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--success)' }}>NODE: ACTIVE</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-label">TOTAL VERIFIED</span>
            <Truck size={20} color="var(--primary)" />
          </div>
          <div className="kpi-value mono">{verifiedHistory.length}</div>
          <div style={{ fontSize: '10px', color: 'var(--success)' }}>↑ 12% FROM LAST SHIFT</div>
        </div>
        <div className="glass-panel kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-label">QUALIFIED RATE</span>
            <ShieldCheck size={20} color="var(--accent)" />
          </div>
          <div className="kpi-value mono" style={{ color: 'var(--accent)' }}>
            {((verifiedHistory.filter(h => h.status === 'PASS').length / verifiedHistory.length) * 100 || 0).toFixed(1)}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>TARGET: 98.5%</div>
        </div>
        <div className="glass-panel kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="kpi-label">AUDIT STATUS</span>
            <Activity size={20} color="var(--success)" />
          </div>
          <div className="kpi-value mono" style={{ color: 'var(--success)' }}>SECURE</div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>LAST SYNC: JUST NOW</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-3 space-y-6">
           <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 className="section-label">CATEGORIES</h3>
            <div className="space-y-3">
              {materialCategories.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: selectedCategory === cat.id ? 'linear-gradient(90deg, var(--primary) 0%, #FF7043 100%)' : 'rgba(0,0,0,0.2)',
                    color: selectedCategory === cat.id ? '#000' : 'var(--text-dim)',
                    border: '1px solid', borderColor: selectedCategory === cat.id ? 'transparent' : 'var(--border)',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'background 0.3s, color 0.3s',
                    fontWeight: '800', fontSize: '12px', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                    <div style={{ opacity: selectedCategory === cat.id ? 1 : 0.6, color: selectedCategory === cat.id ? '#000' : 'var(--primary)' }}>{cat.icon}</div>
                    <span>{cat.name.toUpperCase()}</span>
                  </div>
                  {selectedCategory === cat.id && (
                    <motion.div layoutId="activeCategoryDot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 className="section-label">SAMPLE QUEUE</h3>
            <div className="grid grid-cols-1 gap-3">
              {['Sample-1', 'Sample-2', 'Sample-3'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSample(s)}
                  style={{
                    width: '100%', padding: '20px',
                    background: selectedSample === s ? 'rgba(255, 87, 34, 0.08)' : 'rgba(0,0,0,0.2)',
                    border: '1px solid', borderColor: selectedSample === s ? 'var(--primary)' : 'var(--border)',
                    borderRadius: '12px', color: '#fff', fontSize: '12px', fontWeight: '800', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  {s.toUpperCase()}
                  {selectedSample === s && <motion.div layoutId="activeDot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }}></motion.div>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-10">
          <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
            {isVerifying && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                 style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,8,0.9)', backdropFilter: 'blur(40px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
               >
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <Activity size={64} color="var(--primary)" />
                 </motion.div>
                 <h2 style={{ marginTop: '32px', letterSpacing: '0.6em', fontSize: '1.4rem', fontWeight: '900' }}>AUTHORIZING</h2>
                 <p className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '12px' }}>STAMPING SECURE BLOCKCHAIN HASH...</p>
               </motion.div>
            )}
            
            <div style={{ padding: '40px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(255,87,34,0.05) 0%, transparent 100%)' }}>
               <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#fff', marginBottom: '4px' }}>
                    {selectedCategory.replace('_', ' ').toUpperCase()} 
                  </h2>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>TECHNICAL INSPECTION INTERFACE | V4.2</div>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>BATCH_{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>4-5-26 | {new Date().toLocaleTimeString()}</div>
               </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>TEST PARAMETER</th>
                  <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>TECHNICAL RESULT</th>
                  <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>SPECIFICATION</th>
                  <th style={{ padding: '24px 40px', textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>OBSERVATION</th>
                </tr>
              </thead>
              <tbody>
                {(CATEGORY_SPECS[selectedCategory] || []).map((spec, idx) => {
                  const val = qcData[spec.key] || 0;
                  const isPass = checkPass(val, spec.range);
                  return (
                    <tr key={spec.key} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }} className="table-row">
                      <td style={{ padding: '24px 40px', fontSize: '14px', fontWeight: '700' }}>{spec.label}</td>
                      <td style={{ padding: '24px 40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <input 
                            type="number" name={spec.key} value={val} onChange={handleInputChange} step="0.001"
                            className="input-field"
                            style={{ width: '130px', borderColor: isPass ? 'rgba(0, 255, 148, 0.2)' : 'rgba(255, 68, 68, 0.2)' }}
                          />
                          <span className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '700' }}>{spec.unit}</span>
                        </div>
                      </td>
                      <td className="mono" style={{ padding: '24px 40px', fontSize: '13px', color: 'var(--text-dim)' }}>{spec.spec}</td>
                      <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                        <div className="status-badge" style={{ 
                          background: isPass ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                          color: isPass ? 'var(--success)' : 'var(--error)',
                          border: `1px solid ${isPass ? 'rgba(0, 255, 148, 0.2)' : 'rgba(255, 68, 68, 0.2)'}`,
                          display: 'inline-block', minWidth: '100px'
                        }}>
                          {isPass ? 'NOMINAL' : 'DEVIATION'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: '40px' }}>
                  <div className="highlight-section" style={{ marginBottom: 0 }}>
                     <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                     <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>IN-SPEC</span>
                  </div>
                  <div className="highlight-section" style={{ marginBottom: 0 }}>
                     <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--error)', boxShadow: '0 0 10px var(--error)' }}></div>
                     <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>OUT-SPEC</span>
                  </div>
               </div>
               <button 
                 onClick={handleVerify} 
                 className="btn-industrial" 
                 style={{ padding: '16px 48px', fontSize: '13px' }}
                 disabled={isVerifying}
               >
                 <ShieldCheck size={20} /> AUTHORIZE & COMMIT
               </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.2rem', fontWeight: '900' }}>
                <Database size={24} color="var(--primary)" />
                VERIFIED AUDIT LOG
              </h3>
              <button onClick={() => alert("EXPORTING MASTER REPORT...")} className="btn-outline">
                <BarChart3 size={16} /> GENERATE MASTER REPORT
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {verifiedHistory.map(entry => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="glass-panel" 
                  style={{ padding: '32px', borderLeft: `6px solid ${entry.status === 'PASS' ? 'var(--success)' : 'var(--error)'}`, background: 'rgba(255,255,255,0.01)' }}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="mono" style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>{entry.id}</span>
                        <div className="status-badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '11px' }}>{entry.category}</div>
                      </div>
                      <p className="mono" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>AUTHENTICATED BY QC-COMMANDER | {entry.date} @ {entry.time}</p>
                    </div>
                    <div style={{ 
                      padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '900',
                      background: entry.status === 'PASS' ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                      color: entry.status === 'PASS' ? 'var(--success)' : 'var(--error)',
                      border: `1px solid ${entry.status === 'PASS' ? 'rgba(0, 255, 148, 0.2)' : 'rgba(255, 68, 68, 0.2)'}`
                    }}>
                      {entry.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {entry.results.map((r, ri) => (
                      <div key={ri} style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.1em' }}>{r.label}</div>
                        <div className="mono" style={{ fontSize: '13px', fontWeight: '800', color: r.passed ? '#fff' : 'var(--error)' }}>
                          {r.value}{r.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* CONSOLIDATED MASTER SUMMARY */}
            {verifiedHistory.length > 0 && (
              <div style={{ marginTop: '48px', borderTop: '2px solid var(--border)', paddingTop: '48px' }}>
                <h4 style={{ color: 'var(--primary)', letterSpacing: '0.3em', fontSize: '10px', fontWeight: '900', marginBottom: '24px' }}>CONSOLIDATED MASTER INTELLIGENCE REPORT</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {materialCategories.map(cat => {
                    const batches = verifiedHistory.filter(h => h.category === cat.name.toUpperCase());
                    if (batches.length === 0) return null;
                    const passCount = batches.filter(b => b.status === 'PASS').length;
                    return (
                      <div key={cat.id} className="glass-panel" style={{ padding: '24px', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontWeight: '900', fontSize: '12px' }}>{cat.name.toUpperCase()}</span>
                          <span className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{batches.length} SAMPLES</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#00FF94', opacity: passCount / batches.length }}></div>
                          <div style={{ flex: 1, height: '4px', background: '#FF4444', opacity: (batches.length - passCount) / batches.length }}></div>
                        </div>
                        <div className="flex justify-between">
                          <div style={{ fontSize: '9px' }}>PASS RATE: <span style={{ color: '#00FF94' }}>{((passCount / batches.length) * 100).toFixed(0)}%</span></div>
                          <div style={{ fontSize: '9px' }}>FAIL RATE: <span style={{ color: '#FF4444' }}>{(((batches.length - passCount) / batches.length) * 100).toFixed(0)}%</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="glass-panel" style={{ padding: '32px', marginTop: '32px' }}>
            <h3 style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
              <Activity size={18} color="var(--primary)" /> QUALITY STABILITY TREND
            </h3>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.5 }}
              style={{ height: '300px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="sample" stroke="var(--text-dim)" fontSize={10} />
                  <YAxis yAxisId="left" stroke="var(--primary)" fontSize={10} domain={[1.15, 1.45]} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={10} domain={[65, 75]} />
                  <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)' }} />
                  <Bar yAxisId="left" dataKey="ad" name="Density" fill="var(--primary)" opacity={0.3} radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="lead" name="Lead Oxide %" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GRID_SPECS = {
  "DN": { weight: "145 ± 3g", thickness: "2.6mm" },
  "DNA": { weight: "220 ± 3g", thickness: "3.5mm" },
  "AN": { weight: "190 ± 3g", thickness: "3.1mm" },
  "TN": { weight: "175 ± 3g", thickness: "3.1mm" },
  "BN": { weight: "140 ± 3g", thickness: "3.1mm" },
  "NS40 POS": { weight: "103 ± 3g", thickness: "1.6mm" },
  "NS40 NEG": { weight: "98 ± 3g", thickness: "1.4mm" },
  "AUTO POS": { weight: "145 ± 3g", thickness: "2.0mm" },
  "AUTO NEG": { weight: "105 ± 3g", thickness: "1.6mm" },
  "7AH POS": { weight: "220 ± 3g", thickness: "2.5mm" },
  "7AH NEG": { weight: "130 ± 3g", thickness: "1.6mm" }
};

// TEMPERATURE THRESHOLDS FOR ALERTS
const TEMP_LIMITS = {
  grid_casting: {
    potTemp: { min: 500, max: 540, warn_min: 510, warn_max: 530 },
    ladleTemp: { min: 500, max: 540, warn_min: 510, warn_max: 530 },
    moldTempInside: { min: 120, max: 180, warn_min: 140, warn_max: 160 },
    moldTempOutside: { min: 130, max: 170, warn_min: 145, warn_max: 155 }
  },
  spine_casting: {
    meltTemp: { min: 460, max: 500, warn_min: 470, warn_max: 490 },
    injectionPressure: { min: 100, max: 140, warn_min: 110, warn_max: 130 }
  },
  charging: {
    electrolyteTemp: { min: 25, max: 45, warn_min: 30, warn_max: 42 },
    current: { min: 10, max: 100, warn_min: 15, warn_max: 90 },
    voltage: { min: 2, max: 16, warn_min: 2.1, warn_max: 15.5 }
  }
};

const ProcessPage = ({ addNotification }) => {
  const [activeProcess, setActiveProcess] = useState('overview');
  
  const [processStates, setProcessStates] = useState({
    grid_casting: { 
      docNo: 'MIPL/GC/001', revNo: '02 / 2026', 
      dateShift: '2026-05-11 / DAY', machineNo: '', operator: '', 
      alloyType: '', alloySource: '',
      potTemp: 0, ladleTemp: 0, moldTempInside: 0, moldTempOutside: 0, 
      machineSpeed: 0, gridType: '', gridSpecWt: '',
      // Live Log Entry Temp State
      interval: '0-30',
      weightOp1: 0, weightOp2: 0, 
      weightQA1: 0, weightQA2: 0, 
      rollLug: 'PASS', rollBanding: 'PASS', rollCrack: 'PASS',
      visual: 'PASS', dimension: 'OK', 
      prodQty: 0, remarks: '',
      // Summary
      totalShiftProd: 0, totalIngotUsed: 0, drossKg: 0, lotNo: '', 
      totalBreakdown: 0, hourlyIngotUsed: 0, hourlyTrayRejection: 0, machineProblem: '',
      operatorSign: '', supervisorSign: '', qcSign: ''
    },
    spine_casting: { meltTemp: 0, injectionPressure: 0, cycleTime: 0, spineWeight: 0 },
    oxide_filling: { fillingWeight: 0, powderDensity: 0, fillingRate: 0, tubeWeight: 0, moisture: 0 },
    pickling: { acidConcentration: 0, picklingTemp: 0, immersionTime: 0, purity: 0 },
    pasting: { pasteWeight: 0, pasteMoisture: 0, pasteDensity: 0, penetration: 0, thickness: 0 },
    curing_drying: { curingTemp: 0, curingHumidity: 0, tempProfile: '', curingTime: 0, status: '' },
    charging: { 
      docNo: 'MIPL/CH/007', revNo: '01 / 2026',
      circuitNo: '', batteryType: '', 
      currentSetting: 0, voltageSetting: 0,
      electrolyteTemp: 0, specificGravity: 0,
      startTime: '', endTime: '',
      operator: '', supervisorSign: '', qcSign: ''
    }
  });

  const [temperatureHistory, setTemperatureHistory] = useState({
    grid_casting: [],
    spine_casting: [],
    oxide_filling: [],
    pickling: [],
    pasting: [],
    curing_drying: [],
    charging: []
  });

  const telemetry = temperatureHistory;
  const [alertLog, setAlertLog] = useState([]);
  const [qcLogs, setQcLogs] = useState([]);

  const processes = [
    { id: 'overview', name: 'System Overview', icon: <Radio size={18} /> },
    { id: 'grid_casting', name: 'Grid Casting', icon: <Zap size={18} /> },
    { id: 'spine_casting', name: 'Spine Casting', icon: <Activity size={18} /> },
    { id: 'oxide_filling', name: 'Oxide Filling', icon: <Database size={18} /> },
    { id: 'pickling', name: 'Pickling', icon: <FlaskConical size={18} /> },
    { id: 'pasting', name: 'Pasting', icon: <Layers size={18} /> },
    { id: 'curing_drying', name: 'Curing & Drying', icon: <Clock size={18} /> },
    { id: 'charging', name: 'Charging', icon: <BatteryCharging size={18} /> }
  ];

  const getTemperatureStatus = (process, param, value) => {
    const limits = TEMP_LIMITS[process];
    if (!limits || !limits[param]) return 'normal';

    const { min, max, warn_min, warn_max } = limits[param];
    if (value > max || value < min) return 'critical';
    if (value > warn_max || value < warn_min) return 'warning';
    return 'normal';
  };

  const notifyTemperatureChange = (process, param, value) => {
    const status = getTemperatureStatus(process, param, value);
    if (status === 'normal') return status;

    const { min, max } = TEMP_LIMITS[process][param];
    const title = status === 'critical' ? 'CRITICAL TEMP ALERT' : 'TEMP WARNING';
    const type = status === 'critical' ? 'error' : 'warning';
    const message = status === 'critical'
      ? `${process}: ${param} = ${value} (Limit: ${min}-${max}°C). Notify: OPERATOR | ADMIN | DIRECTOR`
      : `${process}: ${param} = ${value} approaching limit. Notify: OPERATOR | ADMIN`;

    addNotification({ title, message, type });
    setAlertLog(prev => [{
      id: prev.length + 1,
      type: status,
      process,
      param,
      value,
      limit: `${min}-${max}`,
      role: status === 'critical' ? 'DIRECTOR' : 'ADMIN',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE'
    }, ...prev]);

    return status;
  };

  const handleProcessChange = (proc, field, value) => {
    const numValue = parseFloat(value);
    const nextValue = Number.isNaN(numValue) ? value : numValue;

    setProcessStates(prev => {
      const updated = { ...prev[proc], [field]: nextValue };
      if (!Number.isNaN(numValue)) {
        notifyTemperatureChange(proc, field, numValue);
      }
      return { ...prev, [proc]: updated };
    });
  };

  const commitProcessData = (proc) => {
    const updated = processStates[proc];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTemperatureHistory(historyPrev => {
      const currentProcHistory = [...(historyPrev[proc] || [])];
      let newEntry = {};

      if (proc === 'grid_casting') {
        newEntry = {
          time: timeStr,
          interval: updated.interval,
          potTemp: updated.potTemp,
          ladleTemp: updated.ladleTemp,
          moldIn: updated.moldTempInside,
          moldOut: updated.moldTempOutside,
          weights: {
            op: [updated.weightOp1, updated.weightOp2],
            qa: [updated.weightQA1, updated.weightQA2]
          },
          rollTest: {
            lug: updated.rollLug,
            banding: updated.rollBanding,
            crack: updated.rollCrack
          },
          visual: updated.visual,
          prodQty: updated.prodQty,
          remarks: updated.remarks
        };
      } else if (proc === 'spine_casting') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          meltTemp: updated.meltTemp,
          pressure: updated.injectionPressure
        };
      } else if (proc === 'oxide_filling') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          fillingWeight: updated.fillingWeight,
          density: updated.powderDensity
        };
      } else if (proc === 'pickling') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          concentration: updated.acidConcentration,
          temperature: updated.picklingTemp
        };
      } else if (proc === 'pasting') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          pasteWeight: updated.pasteWeight,
          moisture: updated.pasteMoisture
        };
      } else if (proc === 'curing_drying') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          temp: updated.curingTemp,
          humidity: updated.curingHumidity
        };
      } else if (proc === 'charging') {
        newEntry = {
          cycle: currentProcHistory.length + 1,
          temp: updated.electrolyteTemp,
          gravity: updated.specificGravity,
          current: updated.currentSetting,
          voltage: updated.voltageSetting
        };
      }

      if (Object.keys(newEntry).length > 0) {
        addNotification({ 
          title: "DATA LOGGED", 
          message: `TELEMETRY RECORDED FOR ${proc.toUpperCase()} AT ${timeStr}`, 
          type: "success" 
        });
        return {
          ...historyPrev,
          [proc]: [...currentProcHistory.slice(-29), newEntry]
        };
      }
      return historyPrev;
    });
  };

  const getAverageTemp = (data, field) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + (parseFloat(curr[field]) || 0), 0);
    return (sum / data.length).toFixed(1);
  };

  const renderActiveSection = () => {
    const data = processStates[activeProcess];
    
    switch(activeProcess) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div style={{ textAlign: 'center' }}>
              <span className="section-label" style={{ justifyContent: 'center' }}>BATTERY CONTROL</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-0.04em', background: 'linear-gradient(to bottom, #fff 40%, #666)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BATTERY PROCESS INTELLIGENCE
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processes.slice(1).map(p => (
                <motion.div 
                  key={p.id} 
                  whileHover={{ y: -10 }}
                  className="glass-panel" 
                  style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="section-label" style={{ color: 'var(--text-dim)' }}>NODE ID: SG-0{p.id === 'grid_casting' ? 1 : 2}</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginTop: '4px' }}>{p.name.toUpperCase()}</h3>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(255,87,34,0.1)', borderRadius: '12px', color: 'var(--primary)' }}>{p.icon}</div>
                  </div>
                  <div className="flex items-end gap-4 mb-6">
                    <div className="mono" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--success)', lineHeight: 1 }}>99.8%</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '800', marginBottom: '4px' }}>YIELD</span>
                  </div>
                  <button className="btn-industrial" style={{ width: '100%', fontSize: '10px' }} onClick={() => setActiveProcess(p.id)}>INITIALIZE CONSOLE</button>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'grid_casting':
        const gcAvgPotTemp = getAverageTemp(telemetry.grid_casting, 'potTemp');
        const gcAvgLadleTemp = getAverageTemp(telemetry.grid_casting, 'ladleTemp');
        const gcAvgMoldIn = getAverageTemp(telemetry.grid_casting, 'moldTempInside');
        const gcAvgMoldOut = getAverageTemp(telemetry.grid_casting, 'moldTempOutside');
        
        return (
          <div className="space-y-10">
            {/* OFFICIAL DOCUMENT HEADER */}
            <header className="glass-panel" style={{ padding: '24px 40px', borderLeft: '4px solid var(--primary)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <div style={{ fontSize: '28px', fontWeight: '950', letterSpacing: '-0.02em', color: 'var(--primary)' }}>MEGAMP</div>
                  <div style={{ width: '2px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div>
                    <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.1em' }}>PROCESS CONTROL CHART</h1>
                    <h2 style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px', textTransform: 'uppercase' }}>GRID CASTING MODULE - MIPL UNIT</h2>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>DOC. NO</div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#fff' }}>{data.docNo}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>REV. NO / DATE</div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent)' }}>{data.revNo}</div>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-12 gap-10">
              {/* SECTION 1: IDENTITY & SETUP */}
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">1. IDENTITY & SETUP</h3>
                  <div className="grid grid-cols-1 gap-5 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DATE / SHIFT</label><input type="text" className="input-field" value={data.dateShift} onChange={(e) => handleProcessChange('grid_casting', 'dateShift', e.target.value)} /></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>MACHINE NO</label><input type="text" className="input-field" value={data.machineNo} onChange={(e) => handleProcessChange('grid_casting', 'machineNo', e.target.value)} /></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>OPERATOR NAME</label><input type="text" className="input-field" value={data.operator} onChange={(e) => handleProcessChange('grid_casting', 'operator', e.target.value)} /></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>ALLOY SOURCE</label><input type="text" className="input-field" value={data.alloySource} onChange={(e) => handleProcessChange('grid_casting', 'alloySource', e.target.value)} /></div>
                    <div>
                      <label className="section-label" style={{ fontSize: '8px' }}>GRID TYPE</label>
                      <select className="input-field" value={data.gridType} onChange={(e) => handleProcessChange('grid_casting', 'gridType', e.target.value)}>
                        <option value="">SELECT TYPE</option>
                        {Object.keys(GRID_SPECS).map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="section-label" style={{ fontSize: '8px' }}>QC VERIF.</label>
                      <select className="input-field" value={data.qcSign} onChange={(e) => handleProcessChange('grid_casting', 'qcSign', e.target.value)}>
                        <option value="VERIFIED">VERIFIED</option><option value="PENDING">PENDING</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 & 3: PARAMETERS & LIVE PRODUCTION */}
              <div className="col-span-12 lg:col-span-8 space-y-10">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">2. THERMAL PARAMETERS & SPECIFICATIONS</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <label className="section-label" style={{ fontSize: '8px' }}>POT TEMP</label>
                      <div style={{ fontSize: '10px', color: 'var(--primary)', marginBottom: '8px' }}>SPEC: 520±20°C</div>
                      <input type="number" className="input-field" value={data.potTemp} onChange={(e) => handleProcessChange('grid_casting', 'potTemp', e.target.value)} />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <label className="section-label" style={{ fontSize: '8px' }}>LADLE TEMP</label>
                      <div style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '8px' }}>SPEC: 520±25°C</div>
                      <input type="number" className="input-field" value={data.ladleTemp} onChange={(e) => handleProcessChange('grid_casting', 'ladleTemp', e.target.value)} />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <label className="section-label" style={{ fontSize: '8px' }}>MOLD IN</label>
                      <div style={{ fontSize: '10px', color: 'var(--success)', marginBottom: '8px' }}>SPEC: 150±35°C</div>
                      <input type="number" className="input-field" value={data.moldTempInside} onChange={(e) => handleProcessChange('grid_casting', 'moldTempInside', e.target.value)} />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <label className="section-label" style={{ fontSize: '8px' }}>MOLD OUT</label>
                      <div style={{ fontSize: '10px', color: 'var(--warning)', marginBottom: '8px' }}>SPEC: 150±20°C</div>
                      <input type="number" className="input-field" value={data.moldTempOutside} onChange={(e) => handleProcessChange('grid_casting', 'moldTempOutside', e.target.value)} />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <label className="section-label" style={{ fontSize: '8px' }}>SPEED</label>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>SPEC: 5 TO 8</div>
                      <input type="number" className="input-field" value={data.machineSpeed} onChange={(e) => handleProcessChange('grid_casting', 'machineSpeed', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(0, 242, 255, 0.03)', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="section-label">3. FREQUENCY SAMPLING & QUALITY CHECK</h3>
                      <p style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>OPERATOR / QA FREQUENCY INTERVAL: 0-30 & 30-60</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px' }}>
                      {['0-30', '30-60'].map(interval => (
                        <button 
                          key={interval}
                          onClick={() => handleProcessChange('grid_casting', 'interval', interval)}
                          style={{ 
                            padding: '8px 24px', 
                            borderRadius: '6px', 
                            fontSize: '11px', 
                            fontWeight: '900',
                            background: data.interval === interval ? 'var(--primary)' : 'transparent',
                            color: data.interval === interval ? '#000' : 'var(--text-dim)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div style={{ width: '4px', height: '16px', background: 'var(--primary)' }}></div>
                        <h4 className="section-label" style={{ fontSize: '9px' }}>OPERATOR GRID PANEL WEIGHT</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="section-label" style={{ fontSize: '8px' }}>FREQ 1 (g)</label><input type="number" className="input-field" value={data.weightOp1} onChange={(e) => handleProcessChange('grid_casting', 'weightOp1', e.target.value)} /></div>
                        <div><label className="section-label" style={{ fontSize: '8px' }}>FREQ 2 (g)</label><input type="number" className="input-field" value={data.weightOp2} onChange={(e) => handleProcessChange('grid_casting', 'weightOp2', e.target.value)} /></div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div style={{ width: '4px', height: '16px', background: 'var(--success)' }}></div>
                        <h4 className="section-label" style={{ fontSize: '9px' }}>QA / PRODUCTION INCHARGE WEIGHT</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="section-label" style={{ fontSize: '8px' }}>FREQ 1 (g)</label><input type="number" className="input-field" value={data.weightQA1} onChange={(e) => handleProcessChange('grid_casting', 'weightQA1', e.target.value)} /></div>
                        <div><label className="section-label" style={{ fontSize: '8px' }}>FREQ 2 (g)</label><input type="number" className="input-field" value={data.weightQA2} onChange={(e) => handleProcessChange('grid_casting', 'weightQA2', e.target.value)} /></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <label className="section-label" style={{ fontSize: '8px' }}>ROLL TEST (90°)</label>
                      <select className="input-field" value={data.rollLug} onChange={(e) => handleProcessChange('grid_casting', 'rollLug', e.target.value)}>
                        <option value="PASS">PASS</option><option value="FAIL">FAIL</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="section-label" style={{ fontSize: '8px' }}>VISUAL INSP.</label>
                      <select className="input-field" value={data.visual} onChange={(e) => handleProcessChange('grid_casting', 'visual', e.target.value)}>
                        <option value="PASS">PASS</option><option value="FAIL">FAIL</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="section-label" style={{ fontSize: '8px' }}>DIMENSION</label>
                      <select className="input-field" value={data.dimension} onChange={(e) => handleProcessChange('grid_casting', 'dimension', e.target.value)}>
                        <option value="OK">OK</option><option value="NOT OK">NOT OK</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-10">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>PROD QTY</label><input type="number" className="input-field" value={data.prodQty} onChange={(e) => handleProcessChange('grid_casting', 'prodQty', e.target.value)} /></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>REMARKS</label><input type="text" className="input-field" value={data.remarks} onChange={(e) => handleProcessChange('grid_casting', 'remarks', e.target.value)} /></div>
                  </div>

                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--primary)', color: '#000', fontWeight: '950', height: '64px', fontSize: '14px' }} onClick={() => commitProcessData('grid_casting')}>
                    LOG PARAMETERS @ {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </button>
                </div>
              </div>

              {/* SECTION 4: SHIFT SUMMARY & SIGN-OFF */}
              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', background: 'rgba(255, 171, 0, 0.03)', border: '1px solid rgba(255, 171, 0, 0.1)' }}>
                  <h3 className="section-label">4. SHIFT SUMMARY & OFFICIAL SIGN-OFF</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mt-10">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="section-label" style={{ fontSize: '8px' }}>TOTAL SHIFT PROD</label>
                      <input type="number" className="input-field mt-2" value={data.totalShiftProd} onChange={(e) => handleProcessChange('grid_casting', 'totalShiftProd', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="section-label" style={{ fontSize: '8px' }}>TOTAL INGOT USED</label>
                      <input type="number" className="input-field mt-2" value={data.totalIngotUsed} onChange={(e) => handleProcessChange('grid_casting', 'totalIngotUsed', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="section-label" style={{ fontSize: '8px' }}>BREAKDOWN TIME</label>
                      <input type="text" className="input-field mt-2" value={data.totalBreakdown} onChange={(e) => handleProcessChange('grid_casting', 'totalBreakdown', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="section-label" style={{ fontSize: '8px' }}>DROSS (KG)</label>
                      <input type="number" className="input-field mt-2" value={data.drossKg} onChange={(e) => handleProcessChange('grid_casting', 'drossKg', e.target.value)} />
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                      <label className="section-label" style={{ fontSize: '8px' }}>LOT NO</label>
                      <input type="text" className="input-field mt-2" value={data.lotNo} onChange={(e) => handleProcessChange('grid_casting', 'lotNo', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 pt-10 border-t border-white/5">
                    <div className="space-y-4">
                      <label className="section-label" style={{ fontSize: '8px', color: 'var(--text-dim)' }}>OPERATOR SIGNATURE</label>
                      <input type="text" className="input-field" value={data.operatorSign} onChange={(e) => handleProcessChange('grid_casting', 'operatorSign', e.target.value)} placeholder="ENTER INITIALS..." />
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }}></div>
                    </div>
                    <div className="space-y-4">
                      <label className="section-label" style={{ fontSize: '8px', color: 'var(--text-dim)' }}>SUPERVISOR SIGNATURE</label>
                      <input type="text" className="input-field" value={data.supervisorSign} onChange={(e) => handleProcessChange('grid_casting', 'supervisorSign', e.target.value)} placeholder="ENTER INITIALS..." />
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }}></div>
                    </div>
                    <div className="space-y-4">
                      <label className="section-label" style={{ fontSize: '8px', color: 'var(--text-dim)' }}>QC SIGNATURE</label>
                      <input type="text" className="input-field" value={data.qcSign} onChange={(e) => handleProcessChange('grid_casting', 'qcSign', e.target.value)} placeholder="ENTER INITIALS..." />
                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TELEMETRY CHART */}
              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px' }}>
                  <h3 className="section-label">GRID THERMAL & WEIGHT DYNAMICS</h3>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '400px', marginTop: '32px' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.grid_casting} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="time" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" stroke="var(--primary)" fontSize={10} domain={[450, 600]} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--success)" fontSize={10} domain={[130, 250]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                        <Bar yAxisId="left" dataKey="potTemp" fill="var(--primary)" radius={[2, 2, 0, 0]} name="POT (°C)" />
                        <Bar yAxisId="left" dataKey="ladleTemp" fill="var(--accent)" radius={[2, 2, 0, 0]} name="LADLE (°C)" />
                        <Bar yAxisId="right" dataKey="weights.op[0]" fill="var(--success)" radius={[2, 2, 0, 0]} name="WEIGHT (g)" />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">OFFICIAL PROCESS LOG (AUDIT READY)</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="status-badge">AUTO-TIME SYNC</div>
                  <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>NOMINAL</div>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px' }}>TIME</th>
                      <th style={{ padding: '12px' }}>INTERVAL</th>
                      <th style={{ padding: '12px' }}>OP WEIGHTS</th>
                      <th style={{ padding: '12px' }}>QA WEIGHTS</th>
                      <th style={{ padding: '12px' }}>QUALITY (R/V/D)</th>
                      <th style={{ padding: '12px' }}>QTY</th>
                      <th style={{ padding: '12px' }}>QC SIGN</th>
                      <th style={{ padding: '12px' }}>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.grid_casting.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900', color: 'var(--primary)' }}>{log.time}</td>
                        <td className="mono">{log.interval}</td>
                        <td className="mono" style={{ color: '#fff' }}>{log.weights.op.join(' | ')}g</td>
                        <td className="mono" style={{ color: 'var(--success)' }}>{log.weights.qa.join(' | ')}g</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <span className="status-badge" style={{ fontSize: '8px', padding: '2px 6px', color: log.rollTest.lug === 'PASS' ? 'var(--success)' : 'var(--error)' }}>R:{log.rollTest.lug}</span>
                            <span className="status-badge" style={{ fontSize: '8px', padding: '2px 6px' }}>V:{log.visual}</span>
                            <span className="status-badge" style={{ fontSize: '8px', padding: '2px 6px' }}>D:OK</span>
                          </div>
                        </td>
                        <td className="mono">{log.prodQty}</td>
                        <td style={{ fontWeight: '700' }}>{data.qcSign || '---'}</td>
                        <td style={{ borderRadius: '0 12px 12px 0', opacity: 0.7 }}>{log.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'spine_casting':
        const scAvgMelt = getAverageTemp(telemetry.spine_casting, 'meltTemp');
        const scAvgPress = getAverageTemp(telemetry.spine_casting, 'pressure');
        
        return (
          <div className="space-y-10">
            {/* ACTIVE ALERTS */}
            {alertLog.filter(a => a.status === 'ACTIVE' && a.process === 'spine_casting').length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel" 
                style={{ padding: '20px 32px', background: 'rgba(255, 7, 58, 0.08)', border: '1px solid rgba(255, 7, 58, 0.3)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <AlertTriangle size={24} color="var(--error)" />
                  <div>
                    <div style={{ fontWeight: '900', color: 'var(--error)', fontSize: '12px', letterSpacing: '0.1em' }}>ACTIVE SPINE ALERTS</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                      {alertLog.filter(a => a.status === 'ACTIVE' && a.process === 'spine_casting').map(a => `${a.param}: ${a.value} (Limit: ${a.limit})`).join(' | ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">COMMAND AUDIT</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/SC/002</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>REV</label><div className="mono" style={{ fontSize: '11px' }}>02 / 2026</div></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(0, 242, 255, 0.05)' }}>
                  <h3 className="section-label">AVERAGE PARAMETERS</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>MELT TEMP AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>{scAvgMelt}°C</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>INJECTION PRESS AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{scAvgPress} bar</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">INJECTION CONTROL</h3>
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>MELT TEMP (480±20)</label>
                      <input type="number" className="input-field" value={data.meltTemp} onChange={(e) => handleProcessChange('spine_casting', 'meltTemp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>PRESSURE (120±10)</label>
                      <input type="number" className="input-field" value={data.injectionPressure} onChange={(e) => handleProcessChange('spine_casting', 'injectionPressure', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--success)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('spine_casting')}>LOG CURRENT PARAMETERS</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 className="section-label" style={{ marginBottom: '8px' }}>PRESSURE & THERMAL STABILITY</h3>
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>INJECTION CYCLE TELEMETRY | DUAL-AXIS ANALYSIS</p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>THERMAL</div>
                          <div style={{ fontSize: '8px', color: 'var(--accent)' }}>LEFT AXIS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>PRESSURE</div>
                          <div style={{ fontSize: '8px', color: 'var(--primary)' }}>RIGHT AXIS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.spine_casting} barGap={4} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                        <YAxis 
                          yAxisId="left" stroke="var(--accent)" fontSize={10} domain={[400, 550]} 
                          axisLine={false} tickLine={false} tickFormatter={(val) => `${val}°C`}
                        />
                        <YAxis 
                          yAxisId="right" orientation="right" stroke="var(--primary)" fontSize={10} domain={[0, 200]} 
                          axisLine={false} tickLine={false} tickFormatter={(val) => `${val}b`}
                        />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(20px)' }} />
                        <Bar yAxisId="left" dataKey="meltTemp" fill="var(--accent)" radius={[2, 2, 0, 0]} name="MELT TEMP" />
                        <Bar yAxisId="right" dataKey="pressure" fill="var(--primary)" radius={[2, 2, 0, 0]} name="PRESSURE" />
                        
                        <ReferenceLine yAxisId="left" y={500} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <ReferenceLine yAxisId="right" y={140} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />

                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} iconType="rect" formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>{value}</span>} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ALERTS LOG */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 className="section-label">SPINE CASTING ALERTS & NOTIFICATIONS</h3>
              <div style={{ marginTop: '24px' }}>
                {alertLog.filter(a => a.process === 'spine_casting').length > 0 ? (
                  <div className="space-y-3">
                    {alertLog.filter(a => a.process === 'spine_casting').slice(0, 5).map(alert => (
                      <div key={alert.id} style={{ 
                        background: alert.type === 'critical' ? 'rgba(255, 7, 58, 0.08)' : 'rgba(255, 171, 0, 0.08)',
                        border: `1px solid ${alert.type === 'critical' ? 'rgba(255, 7, 58, 0.3)' : 'rgba(255, 171, 0, 0.3)'}`,
                        borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: '900', color: alert.type === 'critical' ? 'var(--error)' : 'var(--warning)', letterSpacing: '0.1em' }}>
                            {alert.type.toUpperCase()} - {alert.param.toUpperCase()}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                            Value: {alert.value} | Limit: {alert.limit} | {alert.time}
                          </div>
                        </div>
                        <div className="status-badge" style={{ borderColor: alert.type === 'critical' ? 'var(--error)' : 'var(--warning)', color: alert.type === 'critical' ? 'var(--error)' : 'var(--warning)' }}>
                          {alert.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>No spine casting alerts</div>
                )}
              </div>
            </div>

            {/* DETAILED LOG */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">SPINE PRODUCTION QUALITY LOG</h3>
                <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>NOMINAL</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>CYCLE</th>
                      <th style={{ padding: '12px' }}>SPINE WT</th>
                      <th style={{ padding: '12px' }}>VISUAL</th>
                      <th style={{ padding: '12px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.spine_casting.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>#{log.cycle}</td>
                        <td className="mono">{log.meltTemp}°C</td>
                        <td><span className="status-badge" style={{ background: 'rgba(0,255,148,0.1)', color: 'var(--success)' }}>{log.pressure} bar</span></td>
                        <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge">PASS</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'oxide_filling':
        const ofAvgWeight = getAverageTemp(telemetry.oxide_filling, 'fillingWeight');
        const ofAvgDensity = getAverageTemp(telemetry.oxide_filling, 'density');

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">COMMAND AUDIT</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/OF/003</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>STATION</label><div className="mono" style={{ fontSize: '11px' }}>FILLER-04</div></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(0, 242, 255, 0.05)' }}>
                  <h3 className="section-label">AVERAGE PARAMETERS</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>FILLING WEIGHT AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>{ofAvgWeight}g</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 1210±10g</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>POWDER DENSITY AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{ofAvgDensity} g/cc</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 4.2±0.1</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">FILLING CONTROL INTERFACE</h3>
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>TARGET WEIGHT (1210±10g)</label>
                      <input type="number" className="input-field" value={data.fillingWeight} onChange={(e) => handleProcessChange('oxide_filling', 'fillingWeight', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>POWDER DENSITY (4.2±0.1)</label>
                      <input type="number" className="input-field" value={data.powderDensity} onChange={(e) => handleProcessChange('oxide_filling', 'powderDensity', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--success)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('oxide_filling')}>LOG CURRENT PARAMETERS</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 className="section-label" style={{ marginBottom: '8px' }}>FILLING STABILITY & DENSITY TELEMETRY</h3>
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>BATCH ANALYSIS | DUAL-AXIS MONITORING</p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>WEIGHT</div>
                          <div style={{ fontSize: '8px', color: 'var(--accent)' }}>LEFT AXIS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>DENSITY</div>
                          <div style={{ fontSize: '8px', color: 'var(--primary)' }}>RIGHT AXIS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.oxide_filling} barGap={4} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" stroke="var(--accent)" fontSize={10} domain={[1150, 1250]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}g`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--primary)" fontSize={10} domain={[3.5, 5]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}ρ`} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(20px)' }} />
                        <Bar yAxisId="left" dataKey="fillingWeight" fill="var(--accent)" radius={[2, 2, 0, 0]} name="WEIGHT" />
                        <Bar yAxisId="right" dataKey="density" fill="var(--primary)" radius={[2, 2, 0, 0]} name="DENSITY" />
                        <ReferenceLine yAxisId="left" y={1220} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <ReferenceLine yAxisId="left" y={1200} stroke="var(--warning)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} iconType="rect" formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>{value}</span>} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">OXIDE FILLING QUALITY LOG</h3>
                <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>STABLE</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>BATCH</th>
                      <th style={{ padding: '12px' }}>WEIGHT</th>
                      <th style={{ padding: '12px' }}>DENSITY</th>
                      <th style={{ padding: '12px' }}>OPERATOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.oxide_filling.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>#B-{log.cycle}</td>
                        <td className="mono">{log.fillingWeight}g</td>
                        <td className="mono">{log.density}ρ</td>
                        <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge">STABLE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'pickling':
        const pkAvgConc = getAverageTemp(telemetry.pickling, 'concentration');
        const pkAvgTemp = getAverageTemp(telemetry.pickling, 'temperature');

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">CHEMICAL AUDIT</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/PK/004</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>ACID TYPE</label><div className="mono" style={{ fontSize: '11px' }}>H2SO4 (DILUTE)</div></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(255, 171, 0, 0.05)' }}>
                  <h3 className="section-label">AVERAGE PARAMETERS</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>ACID CONC AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--warning)' }}>{pkAvgConc}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 10±0.5%</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>BATH TEMP AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>{pkAvgTemp}°C</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 45±5°C</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">PICKLING BATH CONTROL</h3>
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>ACID CONCENTRATION (10±0.5%)</label>
                      <input type="number" className="input-field" value={data.acidConcentration} onChange={(e) => handleProcessChange('pickling', 'acidConcentration', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>BATH TEMP (45±5°C)</label>
                      <input type="number" className="input-field" value={data.picklingTemp} onChange={(e) => handleProcessChange('pickling', 'picklingTemp', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--success)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('pickling')}>LOG CURRENT PARAMETERS</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 className="section-label" style={{ marginBottom: '8px' }}>ACID STABILITY & THERMAL PROFILE</h3>
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>BATH TELEMETRY | CHEMICAL DYNAMICS</p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--warning)', boxShadow: '0 0 10px var(--warning-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>CONC</div>
                          <div style={{ fontSize: '8px', color: 'var(--warning)' }}>LEFT AXIS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>TEMP</div>
                          <div style={{ fontSize: '8px', color: 'var(--accent)' }}>RIGHT AXIS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.pickling} barGap={4} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" stroke="var(--warning)" fontSize={10} domain={[8, 12]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--accent)" fontSize={10} domain={[30, 60]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}°C`} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(20px)' }} />
                        <Bar yAxisId="left" dataKey="concentration" fill="var(--warning)" radius={[2, 2, 0, 0]} name="CONCENTRATION" />
                        <Bar yAxisId="right" dataKey="temperature" fill="var(--accent)" radius={[2, 2, 0, 0]} name="TEMPERATURE" />
                        <ReferenceLine yAxisId="left" y={11} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <ReferenceLine yAxisId="right" y={55} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} iconType="rect" formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>{value}</span>} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">PICKLING PROCESS QUALITY LOG</h3>
                <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>NOMINAL</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>BATCH</th>
                      <th style={{ padding: '12px' }}>CONCENTRATION</th>
                      <th style={{ padding: '12px' }}>TEMP</th>
                      <th style={{ padding: '12px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.pickling.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>#PK-{log.cycle}</td>
                        <td className="mono">{log.concentration}%</td>
                        <td className="mono">{log.temperature}°C</td>
                        <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge">PASS</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'pasting':
        const psAvgWeight = getAverageTemp(telemetry.pasting, 'pasteWeight');
        const psAvgMoist = getAverageTemp(telemetry.pasting, 'moisture');

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">PASTE SPECIFICATIONS</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/PS/005</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>PASTE TYPE</label><div className="mono" style={{ fontSize: '11px' }}>POSITIVE ACTIVE MATERIAL</div></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(0, 242, 255, 0.05)' }}>
                  <h3 className="section-label">AVERAGE PARAMETERS</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>PASTE WEIGHT AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>{psAvgWeight}g</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 450±5g</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>MOISTURE AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{psAvgMoist}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 12.5±0.5%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">PASTING MACHINE CONTROL</h3>
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>PASTE WEIGHT (450±5g)</label>
                      <input type="number" className="input-field" value={data.pasteWeight} onChange={(e) => handleProcessChange('pasting', 'pasteWeight', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>MOISTURE CONTENT (12.5±0.5%)</label>
                      <input type="number" className="input-field" value={data.pasteMoisture} onChange={(e) => handleProcessChange('pasting', 'pasteMoisture', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--success)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('pasting')}>LOG CURRENT PARAMETERS</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 className="section-label" style={{ marginBottom: '8px' }}>PASTING PRECISION & MOISTURE STABILITY</h3>
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>PLATE PRODUCTION TELEMETRY | DUAL-AXIS</p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>WEIGHT</div>
                          <div style={{ fontSize: '8px', color: 'var(--accent)' }}>LEFT AXIS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>MOISTURE</div>
                          <div style={{ fontSize: '8px', color: 'var(--primary)' }}>RIGHT AXIS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.pasting} barGap={4} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" stroke="var(--accent)" fontSize={10} domain={[440, 460]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}g`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--primary)" fontSize={10} domain={[11, 14]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(20px)' }} />
                        <Bar yAxisId="left" dataKey="pasteWeight" fill="var(--accent)" radius={[2, 2, 0, 0]} name="WEIGHT" />
                        <Bar yAxisId="right" dataKey="moisture" fill="var(--primary)" radius={[2, 2, 0, 0]} name="MOISTURE" />
                        <ReferenceLine yAxisId="left" y={455} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <ReferenceLine yAxisId="right" y={13.5} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} iconType="rect" formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>{value}</span>} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">PASTING PRODUCTION QUALITY LOG</h3>
                <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>NOMINAL</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>BATCH</th>
                      <th style={{ padding: '12px' }}>WEIGHT</th>
                      <th style={{ padding: '12px' }}>MOISTURE</th>
                      <th style={{ padding: '12px' }}>THICKNESS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.pasting.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>#PS-{log.cycle}</td>
                        <td className="mono">{log.pasteWeight}g</td>
                        <td className="mono">{log.moisture}%</td>
                        <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge">NOMINAL</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'curing_drying':
        const cdAvgTemp = getAverageTemp(telemetry.curing_drying, 'temp');
        const cdAvgHum = getAverageTemp(telemetry.curing_drying, 'humidity');

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">CHAMBER AUDIT</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/CD/006</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>CHAMBER NO</label><div className="mono" style={{ fontSize: '11px' }}>CH-09 (ZONE-2)</div></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(255, 87, 34, 0.05)' }}>
                  <h3 className="section-label">AVERAGE PARAMETERS</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>CHAMBER TEMP AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{cdAvgTemp}°C</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 65±5°C</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>HUMIDITY AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success)' }}>{cdAvgHum}%</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 85±5%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">CHAMBER CONTROL SYSTEM</h3>
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>CHAMBER TEMP (65±5°C)</label>
                      <input type="number" className="input-field" value={data.curingTemp} onChange={(e) => handleProcessChange('curing_drying', 'curingTemp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>HUMIDITY (85±5%)</label>
                      <input type="number" className="input-field" value={data.curingHumidity} onChange={(e) => handleProcessChange('curing_drying', 'curingHumidity', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--success)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('curing_drying')}>LOG CURRENT PARAMETERS</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                    <div>
                      <h3 className="section-label" style={{ marginBottom: '8px' }}>ENVIRONMENTAL STABILITY TELEMETRY</h3>
                      <p style={{ fontSize: '10px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>CHAMBER DYNAMICS | THERMAL & MOISTURE PROFILE</p>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', background: 'rgba(0,0,0,0.3)', padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>TEMP</div>
                          <div style={{ fontSize: '8px', color: 'var(--primary)' }}>LEFT AXIS</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success)', boxShadow: '0 0 10px var(--success-glow)' }}></div>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: '900', color: '#fff' }}>HUMIDITY</div>
                          <div style={{ fontSize: '8px', color: 'var(--success)' }}>RIGHT AXIS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={telemetry.curing_drying} barGap={4} barCategoryGap="25%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" stroke="var(--primary)" fontSize={10} domain={[50, 80]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}°C`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--success)" fontSize={10} domain={[70, 100]} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(20px)' }} />
                        <Bar yAxisId="left" dataKey="temp" fill="var(--primary)" radius={[2, 2, 0, 0]} name="TEMP" />
                        <Bar yAxisId="right" dataKey="humidity" fill="var(--success)" radius={[2, 2, 0, 0]} name="HUMIDITY" />
                        <ReferenceLine yAxisId="left" y={70} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <ReferenceLine yAxisId="right" y={90} stroke="var(--error)" strokeDasharray="5 5" strokeOpacity={0.8} />
                        <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '40px' }} iconType="rect" formatter={(value) => <span style={{ color: 'var(--text-dim)', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>{value}</span>} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-label">CURING & DRYING PROCESS QUALITY LOG</h3>
                <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>OPTIMAL</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>CHAMBER</th>
                      <th style={{ padding: '12px' }}>AVG TEMP</th>
                      <th style={{ padding: '12px' }}>AVG HUMIDITY</th>
                      <th style={{ padding: '12px' }}>DURATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.curing_drying.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>CH-{log.cycle}</td>
                        <td className="mono">{log.temp}°C</td>
                        <td className="mono">{log.humidity}%</td>
                        <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge">IN PROCESS</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'charging':
        const chAvgTemp = getAverageTemp(telemetry.charging, 'temp');
        const chAvgGrav = getAverageTemp(telemetry.charging, 'gravity');

        return (
          <div className="space-y-10">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-12 lg:col-span-4 space-y-10">
                <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
                  <h3 className="section-label">FORMATION COMMAND</h3>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <div><label className="section-label" style={{ fontSize: '8px' }}>DOC ID</label><div className="mono" style={{ fontSize: '11px' }}>MIPL/CH/007</div></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>CIRCUIT NO</label><input type="text" className="input-field" value={data.circuitNo} onChange={(e) => handleProcessChange('charging', 'circuitNo', e.target.value)} /></div>
                    <div><label className="section-label" style={{ fontSize: '8px' }}>BATTERY TYPE</label><input type="text" className="input-field" value={data.batteryType} onChange={(e) => handleProcessChange('charging', 'batteryType', e.target.value)} /></div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="glass-panel" style={{ padding: '32px', background: 'rgba(0, 255, 148, 0.05)' }}>
                  <h3 className="section-label">AVERAGE TELEMETRY</h3>
                  <div className="grid grid-cols-2 gap-6 mt-6">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>ELECTROLYTE TEMP AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--primary)' }}>{chAvgTemp}°C</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 40±5°C</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '8px' }}>SPECIFIC GRAVITY AVG</div>
                      <div className="mono" style={{ fontSize: '20px', fontWeight: '900', color: 'var(--success)' }}>{chAvgGrav}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '4px' }}>Target: 1.250±0.01</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '32px' }}>
                  <h3 className="section-label">CHARGING PARAMETER CONTROL</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>CURRENT (AMPS)</label>
                      <input type="number" className="input-field" value={data.currentSetting} onChange={(e) => handleProcessChange('charging', 'currentSetting', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>VOLTAGE (VOLTS)</label>
                      <input type="number" className="input-field" value={data.voltageSetting} onChange={(e) => handleProcessChange('charging', 'voltageSetting', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>TEMP (°C)</label>
                      <input type="number" className="input-field" value={data.electrolyteTemp} onChange={(e) => handleProcessChange('charging', 'electrolyteTemp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '9px', color: 'var(--text-dim)' }}>GRAVITY</label>
                      <input type="number" step="0.001" className="input-field" value={data.specificGravity} onChange={(e) => handleProcessChange('charging', 'specificGravity', e.target.value)} />
                    </div>
                  </div>
                  <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', background: 'var(--primary)', color: '#000', fontWeight: '900' }} onClick={() => commitProcessData('charging')}>COMMIT CHARGING DATA</button>
                </div>
              </div>

              <div className="col-span-12">
                <div className="glass-panel" style={{ padding: '40px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  <h3 className="section-label" style={{ marginBottom: '40px' }}>CHARGING DYNAMICS & THERMAL STABILITY</h3>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.5 }}
                    style={{ height: '450px', width: '100%' }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={telemetry.charging}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="cycle" stroke="var(--text-dim)" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" stroke="var(--primary)" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--success)" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: 'rgba(10,10,12,0.98)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                        <Bar yAxisId="left" dataKey="current" fill="var(--primary)" radius={[4, 4, 0, 0]} name="CURRENT (A)" />
                        <Line yAxisId="right" type="monotone" dataKey="temp" stroke="var(--accent)" strokeWidth={3} name="TEMP (°C)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
              <h3 className="section-label" style={{ marginBottom: '32px' }}>CHARGING AUDIT LOG</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>STEP</th>
                      <th style={{ padding: '12px' }}>CURRENT</th>
                      <th style={{ padding: '12px' }}>VOLTAGE</th>
                      <th style={{ padding: '12px' }}>TEMP</th>
                      <th style={{ padding: '12px' }}>GRAVITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {telemetry.charging.slice().reverse().map((log, i) => (
                      <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900' }}>STEP-{log.cycle}</td>
                        <td className="mono">{log.current}A</td>
                        <td className="mono">{log.voltage}V</td>
                        <td className="mono">{log.temp}°C</td>
                        <td className="mono" style={{ borderRadius: '0 12px 12px 0' }}>{log.gravity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="space-y-12">
      {/* TOP HORIZON NAVIGATOR */}
      <div className="glass-panel" style={{ padding: '8px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'rgba(10,10,12,0.8)' }}>
        {processes.map(p => (
          <button
            key={p.id}
            onClick={() => setActiveProcess(p.id)}
            className={`sidebar-link ${activeProcess === p.id ? 'active' : ''}`}
            style={{ 
              flex: '1',
              minWidth: '180px',
              textAlign: 'center', 
              padding: '16px 20px', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '12px', 
              fontSize: '11px', 
              fontWeight: '900',
              whiteSpace: 'nowrap'
            }}
          >
            {React.cloneElement(p.icon, { size: 16 })}
            {p.name.toUpperCase()}
          </button>
        ))}
      </div>
      
      <motion.div key={activeProcess} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {renderActiveSection()}
      </motion.div>
    </div>
  );
};

const LabPage = () => {
  const pieData = [
    { name: 'PASS', value: 850 },
    { name: 'FAIL', value: 150 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="cyber-header">
        <div>
          <span className="section-label">BATTERY VALIDATION</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>LAB <span style={{ color: 'var(--primary)' }}>VALIDATION</span></h1>
        </div>
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>SAMPLES: 1,000</div>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--success)' }}>ACCURACY: 99.9%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel kpi-card">
          <span className="kpi-label">TOTAL SAMPLES</span>
          <div className="kpi-value mono">1,000</div>
        </div>
        <div className="glass-panel kpi-card">
          <span className="kpi-label">GLOBAL PASS RATE</span>
          <div className="kpi-value mono" style={{ color: 'var(--success)' }}>85.0%</div>
        </div>
        <div className="glass-panel kpi-card">
          <span className="kpi-label">AVG CAPACITY</span>
          <div className="kpi-value mono" style={{ color: 'var(--accent)' }}>102%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 className="section-label">QUALITY DISTRIBUTION</h3>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '400px', marginTop: '40px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={100} outerRadius={140} paddingAngle={8} dataKey="value">
                  <Cell fill="var(--success)" stroke="transparent" />
                  <Cell fill="var(--error)" stroke="transparent" opacity={0.6} />
                </Pie>
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '12px' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 className="section-label">CAPACITY PERFORMANCE</h3>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '400px', marginTop: '40px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {name: 'C1', val: 12.2}, {name: 'C2', val: 11.8}, {name: 'C3', val: 13.1}, 
                {name: 'C4', val: 12.5}, {name: 'C5', val: 12.9}, {name: 'C6', val: 12.2}
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={11} />
                <YAxis stroke="var(--text-dim)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '12px' }} />
                <Bar dataKey="val" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const InsightsPage = () => {
  const [gridData, setGridData] = useState([]);
  const [chargingData, setChargingData] = useState([]);
  const [filingData, setFilingData] = useState([]);
  const [pastingData, setPastingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gridRes, chargingRes, filingRes, pastingRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/grid_casting`),
          axios.get(`${API_BASE_URL}/charging`),
          axios.get(`${API_BASE_URL}/filing`),
          axios.get(`${API_BASE_URL}/pasting`)
        ]);
        setGridData(gridRes.data);
        setChargingData(chargingRes.data);
        setFilingData(filingRes.data);
        setPastingData(pastingRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Process data for charts
  const gridTempData = gridData.slice(-20).map(d => ({ date: new Date(d.timestamp).toLocaleDateString(), potTemp: d.potTemp, moldTemp: d.ladleTemp, weight: d.panelWeightOperator }));
  const gridWeightData = gridData.map(d => ({ weight: d.panelWeightOperator }));

  const chargingVoltageData = chargingData.slice(-20).map(d => ({ date: d.date, voltage: d.peak_voltage_v, duration: d.charge_duration_hrs, current: d.charging_current_amps }));
  const chargingStatusData = chargingData.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData = Object.entries(chargingStatusData).map(([status, count]) => ({ name: status, value: count }));

  // For Filing, try to extract numerical weights
  const filingWeights = filingData.flatMap(row => 
    Object.values(row).filter(v => typeof v === 'number' && v > 600 && v < 700)
  );
  const filingWeightData = filingWeights.slice(0, 50).map(w => ({ weight: w }));

  // For Pasting, similar
  const pastingWeights = pastingData.flatMap(row => 
    Object.values(row).filter(v => typeof v === 'number' && v > 100 && v < 200)
  );
  const pastingWeightData = pastingWeights.slice(0, 50).map(w => ({ weight: w }));

  // For Filing and Pasting, since messy, show simple stats
  const filingStats = filingData.length > 0 ? {
    totalRows: filingData.length,
    columns: Object.keys(filingData[0] || {}).length
  } : { totalRows: 0, columns: 0 };

  const pastingStats = pastingData.length > 0 ? {
    totalRows: pastingData.length,
    columns: Object.keys(pastingData[0] || {}).length
  } : { totalRows: 0, columns: 0 };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="cyber-header">
        <div>
          <span className="section-label">REALTIME DASHBOARD</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>BATTERY MANUFACTURING <span style={{ color: 'var(--primary)' }}>ANALYTICS</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grid Casting */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="section-label">GRID CASTING - TEMPERATURES & WEIGHTS</h3>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '300px', marginTop: '20px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={gridTempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} />
                <YAxis yAxisId="temp" orientation="left" stroke="var(--primary)" fontSize={10} />
                <YAxis yAxisId="weight" orientation="right" stroke="var(--accent)" fontSize={10} />
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend />
                <Line yAxisId="temp" type="monotone" dataKey="potTemp" stroke="var(--primary)" name="Pot Temp (°C)" strokeWidth={2} />
                <Line yAxisId="temp" type="monotone" dataKey="moldTemp" stroke="var(--success)" name="Mold Temp (°C)" strokeWidth={2} />
                <Bar yAxisId="weight" dataKey="weight" fill="var(--accent)" name="Grid Weight (g)" />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Charging */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="section-label">CHARGING - VOLTAGE & CURRENT</h3>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '300px', marginTop: '20px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chargingVoltageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} />
                <YAxis stroke="var(--text-dim)" fontSize={10} />
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="voltage" stroke="var(--primary)" name="Peak Voltage (V)" strokeWidth={2} />
                <Line type="monotone" dataKey="current" stroke="var(--accent)" name="Charging Current (A)" strokeWidth={2} />
                <Line type="monotone" dataKey="duration" stroke="var(--success)" name="Duration (Hrs)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Filing */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="section-label">FILING - PLATE WEIGHTS DISTRIBUTION</h3>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '300px', marginTop: '20px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filingWeightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="weight" stroke="var(--text-dim)" fontSize={10} />
                <YAxis stroke="var(--text-dim)" fontSize={10} />
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="weight" fill="var(--primary)" name="Plate Weight (g)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Pasting */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 className="section-label">PASTING - PLATE WEIGHTS DISTRIBUTION</h3>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
            style={{ height: '300px', marginTop: '20px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pastingWeightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="weight" stroke="var(--text-dim)" fontSize={10} />
                <YAxis stroke="var(--text-dim)" fontSize={10} />
                <Tooltip contentStyle={{ background: '#000', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Bar dataKey="weight" fill="var(--accent)" name="Pasted Plate Weight (g)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const DataUploadPage = ({ addNotification }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadHistory, setUploadHistory] = useState([
    { id: 'UP-892', filename: 'historical_batch_v2.csv', records: 1450, date: '4-5-26', status: 'SUCCESS' },
    { id: 'UP-891', filename: 'q1_2026_yield_data.xlsx', records: 8200, date: '4-4-26', status: 'SUCCESS' },
  ]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });

      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        navigate('/', { state: { newUpload: response.data } });
      }, 800); // 800ms delay to let the progress bar smoothly reach 100%

    } catch (error) {
      console.error('Data Upload Error:', error);
      if (addNotification) addNotification({ title: 'UPLOAD FAILED', message: error.response?.data?.error || 'Failed to process file. Ensure backend is running.', type: 'error' });
      setIsUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="cyber-header">
        <div>
          <span className="section-label">SECURE DATA BRIDGE</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>DATA <span style={{ color: 'var(--primary)' }}>UPLOAD</span></h1>
        </div>
        <div className="glass-panel" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--text-dim)' }}>PROTOCOL: SECURE-FTP</div>
          <div className="mono" style={{ fontSize: '10px', color: 'var(--success)' }}>NODE: READY</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upload Portal */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          <h3 className="section-label" style={{ marginBottom: '24px' }}>DATA INGESTION PORTAL</h3>
          <div style={{ border: '2px dashed var(--border)', borderRadius: '12px', padding: '60px 40px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', position: 'relative', transition: 'border-color 0.3s' }}>
            <input type="file" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 10 }} accept=".csv,.xlsx,.json" />
            <div style={{ pointerEvents: 'none' }}>
              <Upload size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>{file ? file.name : "DRAG & DROP SECURE FILES"}</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: '11px', letterSpacing: '0.05em' }}>
                {file ? `${(file.size / 1024).toFixed(2)} KB READY FOR INGESTION` : "SUPPORTED FORMATS: CSV, XLSX, JSON (MAX 500MB)"}
              </p>
            </div>
          </div>

          {isUploading && (
            <div style={{ marginTop: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--primary)' }}>SECURE DATA UPLOAD...</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--primary)' }}>{progress}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)', transition: 'width 0.3s' }}></div>
              </div>
            </div>
          )}

          <button className="btn-industrial" style={{ marginTop: '32px', width: '100%', padding: '16px', fontSize: '12px' }} onClick={handleUpload} disabled={!file || isUploading}>
            <Database size={16} style={{ marginRight: '8px' }} />
            {isUploading ? 'PROCESSING...' : 'INITIALIZE UPLOAD'}
          </button>
        </div>

        {/* Upload Audit Log */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="section-label">DATA AUDIT LOG</h3>
            <div className="status-badge" style={{ color: 'var(--success)', borderColor: 'var(--success)' }}>SYNCED</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '11px' }}>
              <thead>
                <tr style={{ color: 'var(--text-dim)', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>BATCH ID</th><th style={{ padding: '12px' }}>FILENAME</th><th style={{ padding: '12px' }}>RECORDS</th><th style={{ padding: '12px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((log, i) => (
                  <tr key={i} style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', fontWeight: '900', color: 'var(--primary)' }}>{log.id}</td>
                    <td className="mono" style={{ color: '#fff' }}>{log.filename}</td>
                    <td className="mono" style={{ color: 'var(--text-dim)' }}>{log.records.toLocaleString()}</td>
                    <td style={{ borderRadius: '0 12px 12px 0' }}><span className="status-badge" style={{ background: log.status === 'SUCCESS' ? 'rgba(0,255,148,0.1)' : 'rgba(255,68,68,0.1)', color: log.status === 'SUCCESS' ? 'var(--success)' : 'var(--error)' }}>{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (titleOrNotification, message = '', type = 'info') => {
    const notification =
      typeof titleOrNotification === 'string'
        ? { title: titleOrNotification, message, type }
        : {
            ...titleOrNotification,
            title: titleOrNotification.title || '',
            message: titleOrNotification.message || '',
            type: titleOrNotification.type || type,
          };

    const id = notification.id ?? Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [{ id, ...notification }, ...prev]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };


  return (
    <Router>
      <Layout notifications={notifications}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ingress" element={<IngressPage />} />
          <Route path="/process" element={<ProcessPage addNotification={addNotification} />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/upload" element={<DataUploadPage addNotification={addNotification} />} />
          <Route path="/april" element={<AprilDashboard />} />
          <Route path="/audit" element={<ManufacturingDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
