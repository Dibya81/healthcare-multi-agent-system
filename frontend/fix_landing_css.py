import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

new_css = """
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --aura-bg: #f5f7ff;
    --aura-surface: #ffffff;
    --text-1: #0f172a;
    --text-2: #475569;
    --text-3: #94a3b8;
    --aura-primary: #5b8def;
    --aura-teal: #2dd4bf;
    --aura-slate: #64748b;
    --aura-glass: rgba(255,255,255,0.72);
    --aura-border: rgba(120,130,180,0.12);
    --font: 'Sora', sans-serif;
    --mono: 'DM Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font);
    background: var(--aura-bg);
    color: var(--text-2);
    overflow-x: hidden;
  }

  ::selection { background: rgba(91,141,239,0.35); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--aura-bg); }
  ::-webkit-scrollbar-thumb { background: rgba(91,141,239,0.4); border-radius: 2px; }

  @keyframes pulse-dot {
    0%,100% { transform: scale(1); opacity:1; }
    50% { transform: scale(1.5); opacity:0.6; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes float-slow {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-18px) rotate(3deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes grid-drift {
    from { background-position: 0 0; }
    to { background-position: 60px 60px; }
  }
  @keyframes breath {
    0%,100% { opacity:0.5; transform: scale(1); }
    50% { opacity:1; transform: scale(1.05); }
  }
  @keyframes heartbeat {
    0%,100% { transform: scale(1); }
    14% { transform: scale(1.15); }
    28% { transform: scale(1); }
    42% { transform: scale(1.08); }
    70% { transform: scale(1); }
  }
  @keyframes scan-line {
    0% { top: 10%; opacity:1; }
    100% { top: 90%; opacity:0; }
  }
  @keyframes glow-ring {
    0%,100% { box-shadow: 0 0 20px rgba(91,141,239,0.2), inset 0 0 20px rgba(91,141,239,0.08); }
    50% { box-shadow: 0 0 50px rgba(91,141,239,0.5), inset 0 0 30px rgba(91,141,239,0.15); }
  }
  @keyframes node-ping {
    0% { transform: scale(1); opacity:1; }
    100% { transform: scale(2.5); opacity:0; }
  }
  @keyframes particle-rise {
    0% { transform: translateY(0) translateX(0); opacity:0.6; }
    100% { transform: translateY(-120px) translateX(20px); opacity:0; }
  }

  /* Nav */
  .nav {
    position: fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding: 1.1rem 3rem;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--aura-border);
    transition: all 0.3s;
  }
  .nav-logo {
    display:flex; align-items:center; gap:10px;
    font-size:0.95rem; font-weight:700; letter-spacing:-0.02em; color:var(--text-1);
    text-decoration:none;
  }
  .logo-dot {
    width:8px; height:8px; border-radius:50%; background:var(--aura-primary);
    box-shadow: 0 0 14px var(--aura-primary);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  .nav-links { display:flex; align-items:center; gap:2.2rem; }
  .nav-links a {
    font-size:0.78rem; font-weight:500; letter-spacing:0.04em;
    color:var(--text-3); text-decoration:none; transition:color 0.2s;
  }
  .nav-links a:hover { color:var(--aura-primary); }
  .nav-cta {
    font-size:0.78rem; font-weight:600; letter-spacing:0.05em;
    padding: 0.48rem 1.1rem;
    border: 1px solid rgba(91,141,239,0.4);
    border-radius:6px; color:var(--aura-primary); text-decoration:none;
    background:rgba(91,141,239,0.1); transition: all 0.25s;
  }
  .nav-cta:hover { background:rgba(91,141,239,0.15); box-shadow: 0 0 20px rgba(91,141,239,0.2); }

  /* SECTION SHARED */
  section { position:relative; overflow:hidden; }
  .section-label {
    display:inline-flex; align-items:center; gap:8px;
    font-size:0.68rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
    color:var(--aura-primary); padding:5px 14px;
    border: 1px solid rgba(91,141,239,0.3);
    border-radius:100px; background:rgba(91,141,239,0.08);
    margin-bottom:1.4rem;
  }
  .section-label::before {
    content:''; width:5px; height:5px; border-radius:50%; background:var(--aura-primary);
    box-shadow:0 0 8px var(--aura-primary); animation: pulse-dot 2s ease-in-out infinite;
  }
  .section-h2 {
    font-size:clamp(2rem,3.5vw,3rem); font-weight:800;
    letter-spacing:-0.03em; line-height:1.12; color:var(--text-1);
    margin-bottom:1.2rem;
  }
  .section-p {
    font-size:1rem; color:var(--text-3); line-height:1.75; max-width:560px;
  }
  .grad { background: linear-gradient(135deg, var(--aura-primary) 0%, var(--aura-teal) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  /* Glass card */
  .glass-card {
    background: var(--aura-surface);
    border: 1px solid var(--aura-border);
    border-radius:20px;
    box-shadow: 0 4px 24px rgba(80,80,140,0.04);
    transition: all 0.35s ease;
  }
  .glass-card:hover {
    border-color: rgba(91,141,239,0.3);
    box-shadow: 0 12px 48px rgba(80,80,140,0.08), 0 0 20px rgba(91,141,239,0.05);
    transform: translateY(-4px);
  }

  /* BTN */
  .btn-primary {
    display:inline-flex; align-items:center; gap:8px;
    font-family:var(--font); font-size:0.88rem; font-weight:600; letter-spacing:0.02em;
    padding: 0.85rem 2rem; border-radius:10px;
    background: linear-gradient(135deg, var(--aura-primary) 0%, #3b67d4 100%);
    color: #fff; border:none; cursor:pointer;
    box-shadow: 0 4px 12px rgba(91,141,239,0.35);
    transition: all 0.25s ease;
    text-decoration:none;
    position:relative; overflow:hidden;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow: 0 6px 20px rgba(91,141,239,0.45); }
  .btn-outline {
    display:inline-flex; align-items:center; gap:8px;
    font-family:var(--font); font-size:0.88rem; font-weight:600; letter-spacing:0.02em;
    padding: 0.85rem 2rem; border-radius:10px;
    border: 1px solid rgba(120,130,180,0.3);
    color: var(--text-2); background:rgba(255,255,255,0.6); cursor:pointer;
    transition: all 0.25s ease; text-decoration:none;
  }
  .btn-outline:hover { border-color:var(--aura-primary); background:rgba(91,141,239,0.05); color:var(--aura-primary); }

  /* HERO */
  #hero {
    min-height:100vh; padding:7rem 5rem 4rem;
    display:grid; grid-template-columns:1fr 1fr;
    align-items:center; gap:4rem;
  }
  .hero-bg {
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 80% 60% at 75% 40%, rgba(91,141,239,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 15% 75%, rgba(45,212,191,0.06) 0%, transparent 50%);
  }
  .hero-grid {
    position:absolute; inset:0; pointer-events:none;
    background-image:
      linear-gradient(rgba(120,130,180,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(120,130,180,0.06) 1px, transparent 1px);
    background-size:60px 60px;
    animation: grid-drift 25s linear infinite;
  }
  .hero-badge {
    display:inline-flex; align-items:center; gap:8px;
    font-size:0.7rem; font-weight:600; letter-spacing:0.05em; text-transform:uppercase;
    color:var(--aura-primary); padding:6px 14px;
    border: 1px solid rgba(91,141,239,0.3);
    border-radius:100px; background:rgba(91,141,239,0.08);
    margin-bottom:1.8rem;
  }
  .badge-live { width:6px; height:6px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981; animation:pulse-dot 1.5s ease-in-out infinite; }
  .hero-h1 {
    font-size:clamp(2.2rem,3.8vw,3.6rem); font-weight:800;
    letter-spacing:-0.03em; line-height:1.1; color:var(--text-1);
    margin-bottom:1.4rem;
  }
  .hero-sub {
    font-size:1rem; color:var(--text-2); line-height:1.8;
    margin-bottom:2.2rem; max-width:520px;
  }
  .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2.8rem; }
  .trust-row { display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; }
  .trust-item { display:flex; align-items:center; gap:6px; font-size:0.75rem; color:var(--aura-slate); font-weight:500; }
  .trust-item svg { width:14px; height:14px; stroke:var(--aura-primary); fill:none; }

  /* BODY VISUALIZER */
  .hero-right { position:relative; display:flex; align-items:center; justify-content:center; height:560px; }
  .body-core {
    position:relative; width:220px; height:420px;
    animation: float-slow 6s ease-in-out infinite;
  }
  .body-silhouette {
    width:100%; height:100%;
    background: linear-gradient(180deg, rgba(91,141,239,0.05) 0%, rgba(45,212,191,0.08) 40%, rgba(91,141,239,0.05) 100%);
    border: 1px solid rgba(91,141,239,0.2);
    border-radius:60px 60px 40px 40px;
    position:relative; overflow:hidden;
    box-shadow: 0 0 40px rgba(91,141,239,0.1), inset 0 0 20px rgba(255,255,255,0.5);
    animation: glow-ring 4s ease-in-out infinite;
  }
  .body-scan {
    position:absolute; left:0; right:0; height:1px;
    background: linear-gradient(90deg, transparent, var(--aura-primary), transparent);
    animation: scan-line 3s ease-in-out infinite;
    box-shadow: 0 0 8px var(--aura-primary);
  }
  .body-nodes { position:absolute; inset:0; }
  .bnode {
    position:absolute; width:10px; height:10px; border-radius:50%;
    background:var(--aura-primary); box-shadow:0 0 10px var(--aura-primary);
    animation:pulse-dot 2s ease-in-out infinite;
  }
  .bnode::after {
    content:''; position:absolute; inset:-4px; border-radius:50%;
    border: 1px solid rgba(91,141,239,0.4);
    animation: node-ping 2s ease-out infinite;
  }

  /* Floating widgets */
  .fwidget {
    position:absolute;
    background:var(--aura-surface);
    border: 1px solid var(--aura-border);
    border-radius:14px; padding:12px 16px;
    font-size:0.72rem; min-width:140px;
    box-shadow: 0 4px 24px rgba(80,80,140,0.08);
    animation: float 4s ease-in-out infinite;
  }
  .fwidget-label { color:var(--text-3); font-size:0.64rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px; font-weight:600;}
  .fwidget-val { font-size:1.1rem; font-weight:700; color:var(--aura-primary); font-family:var(--mono); }
  .fwidget-sub { color:var(--text-3); font-size:0.62rem; margin-top:2px; font-weight:500;}
  .pulse-bar {
    display:flex; gap:2px; align-items:flex-end; margin-top:8px; height:24px;
  }
  .pb { width:4px; border-radius:2px; background:var(--aura-primary); opacity:0.7; }

  /* Orbit rings */
  .orbit-ring {
    position:absolute; border-radius:50%;
    border: 1px solid rgba(120,130,180,0.15);
    pointer-events:none;
  }

  /* PROBLEM SECTION */
  #problem {
    padding:8rem 5rem;
    background: linear-gradient(180deg, var(--aura-surface) 0%, var(--aura-bg) 100%);
  }
  .problem-header { text-align:center; margin-bottom:4rem; }
  .problems-grid {
    display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:1.5rem; margin-bottom:4rem;
  }
  .problem-card {
    padding:1.8rem; position:relative;
    background: var(--aura-surface);
    border: 1px solid var(--aura-border);
    border-radius:16px; overflow:hidden;
    transition:all 0.3s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .problem-card:hover { border-color:rgba(244,63,94,0.3); transform:translateY(-3px); box-shadow: 0 12px 30px rgba(244,63,94,0.06); }
  .problem-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, rgba(244,63,94,0.6), transparent);
  }
  .problem-icon { font-size:1.4rem; margin-bottom:1rem; }
  .problem-title { font-size:0.95rem; font-weight:700; color:var(--text-1); margin-bottom:0.5rem; }
  .problem-desc { font-size:0.85rem; color:var(--text-2); line-height:1.65; }
  .problem-transition {
    text-align:center; padding:3rem;
    background:rgba(91,141,239,0.05); border-radius:20px;
    border: 1px solid rgba(91,141,239,0.15);
  }
  .problem-transition p { font-size:1.5rem; font-weight:700; color:var(--text-1); }
  .problem-transition p span { color:var(--aura-primary); }

  /* FEATURES */
  #features {
    padding:8rem 5rem;
    background: var(--aura-bg);
  }
  .features-header { text-align:center; margin-bottom:5rem; }
  .feature-card {
    display:grid; grid-template-columns:1fr 1fr;
    gap:3rem; align-items:center;
    padding:3rem; margin-bottom:2rem;
    background:var(--aura-surface);
    border: 1px solid var(--aura-border);
    border-radius:24px;
    box-shadow: 0 4px 24px rgba(80,80,140,0.04);
    transition:all 0.35s ease; cursor:default;
  }
  .feature-card:hover {
    border-color:rgba(91,141,239,0.3);
    box-shadow: 0 12px 48px rgba(80,80,140,0.08);
    transform:translateY(-4px);
  }
  .feature-card.reverse { direction:rtl; }
  .feature-card.reverse > * { direction:ltr; }
  .feature-num {
    font-size:0.68rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
    color:var(--text-3); margin-bottom:1rem; font-family:var(--mono);
  }
  .feature-icon-wrap {
    width:52px; height:52px; border-radius:14px;
    background:rgba(91,141,239,0.08); border: 1px solid rgba(91,141,239,0.2);
    display:flex; align-items:center; justify-content:center;
    font-size:1.5rem; margin-bottom:1.2rem;
    transition:all 0.3s;
  }
  .feature-title { font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; color:var(--text-1); margin-bottom:0.8rem; }
  .feature-desc { font-size:0.9rem; color:var(--text-2); line-height:1.75; margin-bottom:1.5rem; }
  .feature-tags { display:flex; flex-wrap:wrap; gap:8px; }
  .ftag {
    font-size:0.68rem; font-weight:600; letter-spacing:0.02em;
    padding:4px 12px; border-radius:100px;
    background:rgba(91,141,239,0.08); color:var(--aura-primary);
    border: 1px solid rgba(91,141,239,0.15);
  }

  /* Feature Mock UIs */
  .mock-ui {
    background: var(--aura-bg); border-radius:16px; padding:1.5rem;
    border: 1px solid var(--aura-border); overflow:hidden; position:relative;
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.02);
  }
  .mock-header {
    display:flex; align-items:center; gap:8px; margin-bottom:1rem;
  }
  .mock-dots { display:flex; gap:5px; }
  .mock-dot { width:8px; height:8px; border-radius:50%; }
  .mock-title { font-size:0.7rem; color:var(--text-3); font-family:var(--mono); font-weight:600; }

  /* AGENTS */
  #agents {
    padding:8rem 5rem;
    background:var(--aura-surface);
  }
  .agents-header { text-align:center; margin-bottom:5rem; }
  .agent-diagram {
    max-width:900px; margin:0 auto;
    background: var(--aura-bg); border-radius:24px; padding:3rem;
    border: 1px solid var(--aura-border);
    position:relative;
  }
  .agent-center {
    text-align:center; margin-bottom:2.5rem;
    padding:1.5rem; background:var(--aura-surface);
    border-radius:16px; border: 1px solid rgba(91,141,239,0.3);
    box-shadow: 0 4px 24px rgba(80,80,140,0.04);
    position:relative;
  }
  .agent-center-title { font-size:1.1rem; font-weight:700; color:var(--aura-primary); }
  .agent-center-sub { font-size:0.75rem; color:var(--text-3); margin-top:4px; font-weight:500;}
  .agents-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
  .agent-node {
    padding:1.2rem 0.8rem; text-align:center;
    background:var(--aura-surface); border-radius:14px;
    border: 1px solid var(--aura-border);
    transition:all 0.3s; cursor:default; position:relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .agent-node:hover { border-color:rgba(91,141,239,0.4); transform:translateY(-3px); box-shadow:0 8px 24px rgba(91,141,239,0.1); }
  .agent-node-icon { font-size:1.6rem; margin-bottom:0.6rem; }
  .agent-node-name { font-size:0.8rem; font-weight:700; color:var(--text-1); }
  .agent-node-sub { font-size:0.65rem; color:var(--text-2); margin-top:4px; font-weight:500;}
  .flow-down { text-align:center; margin:1rem 0; }
  .flow-down-line { width:1px; height:40px; background:linear-gradient(180deg,rgba(91,141,239,0.5),rgba(91,141,239,0)); margin:0 auto 4px; }
  .flow-down-label { font-size:0.65rem; color:var(--text-3); font-family:var(--mono); font-weight:600;}

  /* TECH */
  #tech {
    padding:8rem 5rem;
    background: linear-gradient(180deg, var(--aura-bg) 0%, var(--aura-surface) 100%);
  }
  .tech-header { text-align:center; margin-bottom:5rem; }
  .tech-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1.5rem; margin-bottom:4rem; }
  .tech-card {
    padding:2rem; border-radius:20px;
    background:var(--aura-surface); border: 1px solid var(--aura-border);
    transition:all 0.3s; position:relative; overflow:hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .tech-card:hover { border-color:rgba(91,141,239,0.3); transform:translateY(-3px); box-shadow: 0 12px 48px rgba(80,80,140,0.08); }
  .tech-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(91,141,239,0.4),transparent);
  }
  .tech-logo {
    width:48px; height:48px; border-radius:12px;
    display:flex; align-items:center; justify-content:center;
    font-size:1.4rem; margin-bottom:1.2rem;
    font-family:var(--mono); font-weight:700;
    background:rgba(91,141,239,0.08); color:var(--aura-primary);
    border: 1px solid rgba(91,141,239,0.2);
  }
  .tech-name { font-size:1rem; font-weight:700; color:var(--text-1); margin-bottom:0.5rem; }
  .tech-desc { font-size:0.85rem; color:var(--text-2); line-height:1.65; }
  .tech-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:1rem; }
  .tech-tag { font-size:0.65rem; padding:4px 10px; border-radius:100px; background:rgba(91,141,239,0.06); color:var(--aura-primary); border: 1px solid rgba(91,141,239,0.15); font-weight:600; }

  /* Pipeline diagram */
  .pipeline-wrap {
    background: var(--aura-surface); border-radius:20px; padding:2.5rem;
    border: 1px solid var(--aura-border); margin-top:3rem; box-shadow: 0 4px 24px rgba(80,80,140,0.04);
  }
  .pipeline-title { font-size:1rem; font-weight:700; color:var(--text-1); margin-bottom:2rem; text-align:center; }
  .pipeline-flow {
    display:flex; align-items:center; gap:0; justify-content:center;
    flex-wrap:nowrap; overflow-x:auto; padding:1rem 0;
  }
  .pipe-node {
    padding:10px 16px; border-radius:10px; text-align:center;
    background:var(--aura-bg); border: 1px solid var(--aura-border);
    font-size:0.75rem; font-weight:600; color:var(--text-2);
    min-width:100px; white-space:nowrap; position:relative; flex-shrink:0;
  }
  .pipe-arrow {
    color:var(--text-3); font-size:1rem; padding:0 8px;
    flex-shrink:0;
  }
  .pipe-node.highlight { background:rgba(91,141,239,0.1); border-color:rgba(91,141,239,0.4); color:var(--aura-primary); }

  /* WHY */
  #why {
    padding:8rem 5rem;
    text-align:center;
    background:var(--aura-surface);
    position:relative;
  }
  .why-bg {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 60% 50% at 50% 50%, rgba(91,141,239,0.06) 0%, transparent 70%);
  }
  .why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.5rem; margin-top:4rem; }
  .why-card {
    padding:2.5rem 2rem; border-radius:20px;
    background: var(--aura-surface); border: 1px solid var(--aura-border);
    text-align:center; transition:all 0.3s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }
  .why-card:hover { border-color:rgba(91,141,239,0.3); transform:translateY(-4px); box-shadow: 0 12px 48px rgba(80,80,140,0.08); }
  .why-num { font-size:2.5rem; font-weight:800; font-family:var(--mono); margin-bottom:0.8rem; color:var(--aura-primary);}
  .why-label { font-size:0.95rem; font-weight:700; color:var(--text-1); margin-bottom:0.5rem; }
  .why-desc { font-size:0.85rem; color:var(--text-2); line-height:1.7; }

  /* FUTURE */
  #future {
    padding:8rem 5rem;
    background:var(--aura-bg);
  }
  .future-header { text-align:center; margin-bottom:5rem; }
  .future-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1.5rem; }
  .future-card {
    padding:2rem; border-radius:20px; position:relative; overflow:hidden;
    background:var(--aura-surface); border: 1px solid var(--aura-border);
    transition:all 0.35s; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  }
  .future-card:hover { transform:translateY(-5px); border-color:rgba(91,141,239,0.3); box-shadow:0 12px 48px rgba(80,80,140,0.08); }
  .future-card::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
    background:linear-gradient(90deg, transparent, rgba(91,141,239,0.4), transparent);
  }
  .future-icon { font-size:2rem; margin-bottom:1rem; }
  .future-title { font-size:1rem; font-weight:700; color:var(--text-1); margin-bottom:0.6rem; }
  .future-desc { font-size:0.85rem; color:var(--text-2); line-height:1.7; }

  /* CTA */
  #cta {
    padding:10rem 5rem;
    text-align:center; position:relative;
    overflow:hidden;
    background: linear-gradient(180deg, var(--aura-surface) 0%, var(--aura-bg) 100%);
  }
  .cta-bg {
    position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(ellipse 70% 60% at 50% 50%, rgba(91,141,239,0.1) 0%, transparent 65%);
    animation:breath 5s ease-in-out infinite;
  }
  .cta-h2 {
    font-size:clamp(2.5rem,5vw,4.5rem); font-weight:800;
    letter-spacing:-0.04em; line-height:1.05;
    color:var(--text-1); margin-bottom:1.5rem;
    position:relative; z-index:2;
  }
  .cta-sub {
    font-size:1.05rem; color:var(--text-2); line-height:1.75;
    max-width:560px; margin:0 auto 3rem;
    position:relative; z-index:2;
  }
  .cta-btn-wrap { position:relative; z-index:2; display:inline-block; }
  .cta-btn {
    display:inline-flex; align-items:center; gap:10px;
    font-family:var(--font); font-size:1.05rem; font-weight:700; letter-spacing:0.01em;
    padding:1.1rem 3rem; border-radius:14px;
    background:linear-gradient(135deg, var(--aura-primary) 0%, #3b67d4 100%);
    color:#fff; border:none; cursor:pointer;
    box-shadow: 0 4px 20px rgba(91,141,239,0.4);
    transition: all 0.3s ease;
    animation: breath 3s ease-in-out infinite;
    text-decoration:none;
  }
  .cta-btn:hover {
    transform:translateY(-3px) scale(1.02);
    box-shadow: 0 8px 30px rgba(91,141,239,0.5);
  }
  .cta-ring {
    position:absolute; top:50%; left:50%;
    transform:translate(-50%,-50%);
    border-radius:50%; border:1px solid rgba(91,141,239,0.15);
    pointer-events:none;
  }

  /* FOOTER */
  footer {
    padding:2rem 5rem; border-top: 1px solid var(--aura-border);
    display:flex; align-items:center; justify-content:space-between;
    background:var(--aura-surface);
  }
  .footer-brand { font-size:0.85rem; font-weight:700; color:var(--text-2); }
  .footer-copy { font-size:0.75rem; color:var(--text-3); font-weight:500;}

  /* Responsive */
  @media(max-width:900px){
    #hero { grid-template-columns:1fr; padding:6rem 2rem 3rem; text-align:center; }
    .hero-btns { justify-content:center; }
    .trust-row { justify-content:center; }
    .hero-right { height:300px; }
    section, #problem, #features, #agents, #tech, #why, #future, #cta { padding:5rem 2rem; }
    .feature-card { grid-template-columns:1fr; }
    .feature-card.reverse { direction:ltr; }
    .agents-grid { grid-template-columns:repeat(3,1fr); }
    .pipeline-flow { flex-wrap:wrap; gap:8px; }
    nav { padding:1rem 1.5rem; }
    .nav-links { display:none; }
    footer { padding:1.5rem 2rem; flex-direction:column; gap:1rem; text-align:center; }
  }
"""

content = re.sub(r'const GLOBAL_CSS = `.*?`;', f'const GLOBAL_CSS = `{new_css}`;', content, flags=re.DOTALL)

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
