"use client"; 
import { useEffect, useRef, useState } from "react";
import HumanBody3D from "@/components/three/HumanBody3D";

// ─── Inline styles / keyframes injected once ───────────────────────────────
const GLOBAL_CSS = `
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
`;

// ─── Wave bars helper ───────────────────────────────────────────────────────
const WaveBars = ({ count = 20, active = true }: { count?: number; active?: boolean }) => {
  const heights = Array.from({ length: count }, (_, i) => {
    const x = (i / count) * Math.PI * 3;
    return Math.max(10, Math.abs(Math.sin(x) * 40 + Math.cos(x * 1.7) * 15 + 20));
  });
  return (
    <div className="waveform">
      {heights.map((h, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            height: active ? `${h}%` : "15%",
            animationDelay: `${i * 0.05}s`,
            opacity: active ? 0.7 + (i % 3) * 0.1 : 0.3,
            transition: `height ${0.3 + (i % 5) * 0.1}s ease`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Animated counter ───────────────────────────────────────────────────────
const Counter = ({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += end / 60;
          if (start < end) { setVal(Math.floor(start)); requestAnimationFrame(step); }
          else setVal(end);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function MedOrchestratorLanding() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [waveActive, setWaveActive] = useState(true);

  // Toggle wave animation
  useEffect(() => {
    const t = setInterval(() => setWaveActive(p => !p), 3000);
    return () => clearInterval(t);
  }, []);

  // Inject global CSS once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const problems = [
    { icon: "🗂️", title: "Fragmented Health Records", desc: "Your medical history is scattered across dozens of providers, systems, and paper files — impossible to access when it matters most." },
    { icon: "⏳", title: "Reactive Healthcare", desc: "The system waits for you to get sick before acting. There is no proactive monitoring, no early warning, no intelligent prevention." },
    { icon: "🚨", title: "Delayed Emergency Response", desc: "In critical moments, precious minutes are lost coordinating care. No automated escalation, no intelligent routing, no real-time data sharing." },
    { icon: "🎯", title: "Zero Personalization", desc: "Generic advice for everyone. Cookie-cutter treatment plans. Your health is unique — but the system treats you as an average." },
    { icon: "🔕", title: "Forgotten Follow-ups", desc: "30% of patients miss recommended follow-ups. Reminders are manual, fragmented, and completely disconnected from your health status." },
    { icon: "📉", title: "Poor Wellness Visibility", desc: "Without continuous monitoring, dangerous patterns build silently. By the time symptoms appear, significant damage may already exist." },
  ];

  const features = [
    {
      num: "01",
      icon: "📋",
      title: "Patient Management Agent",
      desc: "Handles FHIR standard records, patient history compilation, and longitudinal data tracking. Ensures secure, compliant data access across the entire AI ecosystem.",
      tags: ["FHIR CRUD", "Patient History", "Data Sync", "Compliance"],
      mockup: "management",
    },
    {
      num: "02",
      icon: "🔍",
      title: "Diagnostic Agent",
      desc: "Advanced multimodal analysis of patient photos and medical imaging. Correlates visual data with clinical history to suggest potential conditions and findings.",
      tags: ["Photo Analysis", "Imaging AI", "Condition Matching"],
      mockup: "diagnostic",
    },
    {
      num: "03",
      icon: "📅",
      title: "Scheduling Agent",
      desc: "Autonomously manages clinic slots, sends patient reminders, and handles prescription renewals. Optimizes physician calendars without manual intervention.",
      tags: ["Smart Slots", "Auto-Reminders", "Prescriptions", "Calendar Sync"],
      mockup: "scheduling",
    },
    {
      num: "04",
      icon: "🧬",
      title: "Genomics Agent",
      desc: "Processes complex genetic variant pipelines, linking genomic data to potential health risks and personalized treatment pathways.",
      tags: ["Variant Analysis", "Risk Pipelines", "Precision Medicine"],
      mockup: "genomics",
    },
    {
      num: "05",
      icon: "🚨",
      title: "Alerting & Escalation Agent",
      desc: "Monitors all incoming data for critical findings. Instantly escalates severe anomalies to human doctors and notifies necessary emergency contacts.",
      tags: ["Critical Findings", "Auto-Escalation", "Real-time Notifications"],
      mockup: "alerting",
    },
    {
      num: "06",
      icon: "💬",
      title: "Q&A Chatbot Agent",
      desc: "A patient-facing intelligent assistant that answers health queries, explains complex medical terminology, and provides triage guidance.",
      tags: ["Patient Queries", "Medical Explanations", "Triage Guidance"],
      mockup: "chat",
    },
  ];

  const techCards = [
    { logo: "BR", name: "AWS Bedrock", desc: "Powers multi-agent AI reasoning and orchestrates healthcare intelligence with secure, scalable LLM inference across all specialized agents.", tags: ["Multi-Agent", "LLM Inference", "Secure AI"] },
    { logo: "λ", name: "AWS Lambda", desc: "Serverless agent execution with asynchronous event handling. Emergency workflows and real-time AI triggers fire instantly with zero infrastructure overhead.", tags: ["Serverless", "Event-Driven", "Auto-Scale"] },
    { logo: "DB", name: "DynamoDB + RDS", desc: "Patient memory, long-term health tracking, and AI context retrieval through a hybrid database architecture optimized for real-time health intelligence.", tags: ["Health Memory", "Real-time Sync", "Vector DB"] },
    { logo: "AI", name: "LangGraph Orchestrator", desc: "Graph-based multi-agent orchestration with typed state handoffs. Each agent collaborates with precise context — no hallucinations, no lost data.", tags: ["State Management", "Agent Routing", "Checkpointing"] },
  ];

  const whyStats = [
    { num: 50, suffix: "%", label: "Physician Time on Admin", desc: "Doctors spend half their day on paperwork. We automate the workflow, freeing them to focus on care.", color: "#00D4FF" },
    { num: 42, suffix: "%", label: "Clinician Burnout Rate", desc: "Administrative burden is destroying healthcare talent. Autonomous AI absorbs the friction.", color: "#00FFD1" },
    { num: 30, suffix: "%", label: "Missed Follow-ups", desc: "One in three patients never schedules a recommended follow-up. Our agents close this gap automatically.", color: "#00B8D4" },
    { num: 33, suffix: "s", label: "Full Pipeline Completion", desc: "From patient photo upload to appointment confirmed — 33 seconds. No human clicks required.", color: "#00D4FF" },
  ];

  const futureCards = [
    { icon: "🔮", title: "Predictive Wellness Engine", desc: "AI that forecasts health events weeks before symptoms appear, based on continuous behavioral and biometric signals." },
    { icon: "👤", title: "Digital Health Twin", desc: "A living simulation of your physiology — updated in real-time, used to model treatment outcomes and lifestyle changes." },
    { icon: "♾️", title: "AI-Guided Longevity", desc: "Move beyond treating illness toward systematically extending healthspan through personalized AI intervention." },
    { icon: "🌐", title: "Seamless Care Coordination", desc: "An intelligent network where your AI agent coordinates across every provider, specialist, and pharmacy on your behalf." },
  ];

  const pipelineNodes = [
    { label: "Wearables", highlight: false },
    { label: "API Gateway", highlight: false },
    { label: "AWS Lambda", highlight: false },
    { label: "AI Orchestrator", highlight: true },
    { label: "Specialized Agents", highlight: false },
    { label: "Health Engine", highlight: true },
    { label: "Memory Layer", highlight: false },
    { label: "User Dashboard", highlight: false },
  ];

  const renderMockup = (type: string) => {
    return (
      <div className="mock-ui">
        <div className="mock-header">
          <div className="mock-dots">
            <div className="mock-dot" style={{ background: "#ff5f57" }} />
            <div className="mock-dot" style={{ background: "#ffbd2e" }} />
            <div className="mock-dot" style={{ background: "#28c840" }} />
          </div>
          <span className="mock-title">{type}_agent.ai</span>
        </div>
        <div style={{ marginTop: "1rem", padding: "20px", background: "var(--aura-bg)", borderRadius: "10px", border: "1px solid var(--aura-border)", display: "flex", flexDirection: "column", gap: "10px" }}>
           <div className="pb" style={{ width: "80%", height: "8px", background: "var(--aura-primary)", borderRadius: "4px", opacity: 0.5 }} />
           <div className="pb" style={{ width: "60%", height: "8px", background: "var(--aura-teal)", borderRadius: "4px", opacity: 0.5 }} />
           <div className="pb" style={{ width: "90%", height: "8px", background: "var(--aura-primary)", borderRadius: "4px", opacity: 0.3 }} />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="logo-dot" />
          MedOrchestrator AI
        </a>
        <div className="nav-links">
          <a href="#problem">Problem</a>
          <a href="#features">Features</a>
          <a href="#agents">AI Agents</a>
          <a href="#tech">Technology</a>
          <a href="#why">Why Now</a>
        </div>
        <a href="/dashboard" className="nav-cta">Let's Begin →</a>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="hero" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "7rem 5rem 4rem", gap: "4rem", position: "relative", overflow: "hidden" }}>
        <div className="hero-bg" />
        <div className="hero-grid" />

        {/* Particles */}
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: "50%",
            background: "var(--aura-primary)",
            opacity: 0.3 + Math.random() * 0.4,
            animation: `particle-rise ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Left */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-badge">
            <div className="badge-live" />
            AI-Powered Healthcare OS · v2.0 Live
          </div>
          <h1 className="hero-h1">
            Your <span className="grad">AI-Powered</span><br />
            Personal Healthcare<br />
            Operating System
          </h1>
          <p className="hero-sub">
            Monitor, understand, and optimize your health with autonomous AI agents that continuously analyze wellness, predict risks, and provide intelligent healthcare assistance in real time.
          </p>
          <div className="hero-btns">
            <a href="/dashboard" className="btn-primary">
              <span>✦</span> Let's Begin
            </a>
            <a href="#features" className="btn-outline">
              ▶ Watch Demo
            </a>
          </div>
          <div className="trust-row">
            {[
              ["🔒", "HIPAA Compliant"],
              ["⚡", "Real-time AI"],
              ["🌐", "AWS Powered"],
              ["🧬", "5 AI Agents"],
            ].map(([icon, label]) => (
              <div key={label} className="trust-item">
                <span>{icon}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--aura-slate)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Body Visualizer */}
        <div className="hero-right" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "560px" }}>
          {/* Orbit rings */}
          {[220, 280, 340].map((size, i) => (
            <div key={i} className="orbit-ring" style={{ width: size, height: size, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animationDelay: `${i * 0.5}s` }} />
          ))}

          {/* Orbiting dots */}
          {[
            { size: 220, dur: "8s", delay: "0s", color: "#00D4FF" },
            { size: 280, dur: "12s", delay: "2s", color: "#00FFD1" },
            { size: 340, dur: "16s", delay: "4s", color: "#00B8D4" },
          ].map(({ size, dur, delay, color }, i) => (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: size, height: size,
              marginTop: -size / 2, marginLeft: -size / 2,
              animation: `spin-slow ${dur} linear ${delay} infinite`,
            }}>
              <div style={{
                position: "absolute", top: -4, left: "50%", marginLeft: -4,
                width: 8, height: 8, borderRadius: "50%",
                background: color, boxShadow: `0 0 12px ${color}`,
              }} />
            </div>
          ))}

          {/* Body 3D Model */}
          <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%", cursor: "grab" }}>
            <HumanBody3D />
          </div>

          {/* Floating widgets */}
          <div className="fwidget" style={{ top: "8%", right: "2%", animationDelay: "0s" }}>
            <div className="fwidget-label">Heart Rate</div>
            <div className="fwidget-val">72 <span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>bpm</span></div>
            <div className="pulse-bar">
              {[6,12,8,18,10,14,7,20,9,15,6,12].map((h, i) => (
                <div key={i} className="pb" style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          <div className="fwidget" style={{ top: "30%", left: "-10%", animationDelay: "1s" }}>
            <div className="fwidget-label">Wellness Score</div>
            <div className="fwidget-val" style={{ fontSize: "1.6rem" }}>94<span style={{ fontSize: "0.8rem" }}>/100</span></div>
            <div className="fwidget-sub" style={{ color: "#00ff88" }}>● Optimal Range</div>
          </div>

          <div className="fwidget" style={{ bottom: "20%", left: "-8%", animationDelay: "1.5s" }}>
            <div className="fwidget-label">SpO₂</div>
            <div className="fwidget-val">98<span style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>%</span></div>
            <div className="fwidget-sub">Optimal</div>
          </div>

          <div className="fwidget" style={{ bottom: "8%", right: "0%", animationDelay: "0.8s" }}>
            <div className="fwidget-label">AI Insight</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-3)", lineHeight: 1.5 }}>Sleep efficiency<br /><span style={{ color: "var(--aura-primary)" }}>↑ 12% this week</span></div>
          </div>

          <div className="fwidget" style={{ top: "60%", right: "-5%", animationDelay: "2s" }}>
            <div className="fwidget-label">Stress Index</div>
            <div className="fwidget-val" style={{ color: "#ffbd2e" }}>Low</div>
            <div className="fwidget-sub">3.2 / 10</div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section id="problem" style={{ padding: "8rem 5rem", background: "linear-gradient(180deg, var(--aura-bg) 0%, var(--aura-surface) 100%)" }}>
        <div className="problem-header">
          <div className="section-label">The Problem</div>
          <h2 className="section-h2">Healthcare is <span className="grad">broken</span> by design</h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            Today's healthcare system was built for reactive intervention — not continuous, intelligent, personalized care. The cost is measured in lives.
          </p>
        </div>

        <div className="problems-grid">
          {problems.map((p) => (
            <div key={p.title} className="problem-card">
              <div className="problem-icon">{p.icon}</div>
              <div className="problem-title">{p.title}</div>
              <div className="problem-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div className="problem-transition">
          <p>Then we built <span>MedOrchestrator AI</span> — and changed everything.</p>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "8rem 5rem", background: "var(--aura-surface)" }}>
        <div className="features-header">
          <div className="section-label">Core Intelligence</div>
          <h2 className="section-h2">Five AI agents.<br /><span className="grad">One unified system.</span></h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            Each agent is purpose-built for its domain — and together they form an autonomous healthcare ecosystem that never stops working for you.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {features.map((f, i) => (
            <div
              key={f.num}
              className={`feature-card ${i % 2 === 1 ? "reverse" : ""}`}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div>
                <div className="feature-num">Feature {f.num}</div>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-tags">
                  {f.tags.map(t => <span key={t} className="ftag">{t}</span>)}
                </div>
              </div>
              {renderMockup(f.mockup)}
            </div>
          ))}
        </div>
      </section>

      {/* ── AGENTS ───────────────────────────────────────────────────────── */}
      <section id="agents" style={{ padding: "8rem 5rem", background: "var(--aura-bg)" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="section-label">AI Orchestration</div>
          <h2 className="section-h2">Autonomous agents<br /><span className="grad">working in concert</span></h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            A graph-based multi-agent system where specialized AI agents collaborate through typed state handoffs — no hallucinations, no lost context.
          </p>
        </div>

        <div className="agent-diagram">
          {/* Input */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{ padding: "10px 28px", background: "rgba(0,0,0,0.02)", border: "0.5px solid var(--glass-border)", borderRadius: "10px", fontSize: "0.8rem", color: "var(--text-3)" }}>
              🩺 User Health Data · Wearables · Symptoms · History
            </div>
          </div>

          <div className="flow-down">
            <div className="flow-down-line" />
            <div className="flow-down-label">↓</div>
          </div>

          {/* Orchestrator */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "inline-block", padding: "1.2rem 3rem", background: "rgba(91,141,239,0.15)", border: "1px solid rgba(91,141,239,0.5)", borderRadius: "16px", position: "relative" }}>
              <div style={{ fontSize: "0.68rem", color: "var(--aura-primary)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Core Intelligence</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-1)" }}>Orchestrator Agent</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: "4px" }}>Plans · Delegates · Re-plans · Checkpoints</div>
              <div style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: "var(--aura-primary)", boxShadow: "0 0 12px var(--aura-primary)", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
            </div>
          </div>

          <div className="flow-down">
            <div className="flow-down-line" />
            <div className="flow-down-label">↓</div>
          </div>

          {/* 5 Agents */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { icon: "❤️", name: "Monitoring Agent", sub: "Vitals & Anomaly" },
              { icon: "🧠", name: "Symptom Agent", sub: "Pattern Analysis" },
              { icon: "🚑", name: "Emergency Agent", sub: "Critical Response" },
              { icon: "🌿", name: "Wellness Agent", sub: "Optimization" },
              { icon: "🧬", name: "Memory Agent", sub: "Longitudinal AI" },
            ].map((a) => (
              <div key={a.name} className="agent-node">
                <div className="agent-node-icon">{a.icon}</div>
                <div className="agent-node-name">{a.name}</div>
                <div className="agent-node-sub">{a.sub}</div>
              </div>
            ))}
          </div>

          <div className="flow-down">
            <div className="flow-down-line" />
            <div className="flow-down-label">↓</div>
          </div>

          {/* Output */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {["🔍 AI Health Insights", "📋 Personalized Recommendations", "🚨 Emergency Actions"].map(label => (
              <div key={label} style={{ padding: "10px 20px", background: "rgba(91,141,239,0.1)", border: "0.5px solid rgba(91,141,239,0.2)", borderRadius: "10px", fontSize: "0.75rem", color: "var(--aura-primary)" }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH ─────────────────────────────────────────────────────────── */}
      <section id="tech" style={{ padding: "8rem 5rem", background: "linear-gradient(180deg, var(--aura-surface) 0%, var(--aura-bg) 100%)" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div className="section-label">Architecture</div>
          <h2 className="section-h2">Enterprise-grade<br /><span className="grad">AI infrastructure</span></h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            Built on AWS's most powerful healthcare services with a multi-agent orchestration architecture designed for reliability, scale, and security.
          </p>
        </div>

        <div className="tech-grid">
          {techCards.map((t) => (
            <div key={t.name} className="tech-card glass-card">
              <div className="tech-logo">{t.logo}</div>
              <div className="tech-name">{t.name}</div>
              <div className="tech-desc">{t.desc}</div>
              <div className="tech-tags">
                {t.tags.map(tag => <span key={tag} className="tech-tag">{tag}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="pipeline-wrap">
          <div className="pipeline-title">Real-Time Data Pipeline</div>
          <div className="pipeline-flow">
            {pipelineNodes.map((node, i) => (
              <div key={node.label} style={{ display: "flex", alignItems: "center" }}>
                <div className={`pipe-node ${node.highlight ? "highlight" : ""}`}>{node.label}</div>
                {i < pipelineNodes.length - 1 && <div className="pipe-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ──────────────────────────────────────────────────────────── */}
      <section id="why" style={{ padding: "8rem 5rem", textAlign: "center", background: "var(--aura-surface)", position: "relative" }}>
        <div className="why-bg" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="section-label">Why This Matters</div>
          <h2 className="section-h2">Healthcare shouldn't wait<br />for you to <span className="grad">break down</span></h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            The cost of reactive healthcare is measured in delayed diagnoses, missed interventions, and lives cut short. AI can change this — now.
          </p>

          <div className="why-grid">
            {whyStats.map((s) => (
              <div key={s.label} className="why-card">
                <div className="why-num" style={{ color: s.color }}>
                  <Counter end={s.num} suffix={s.suffix} />
                </div>
                <div className="why-label">{s.label}</div>
                <div className="why-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "4rem", padding: "2.5rem", background: "rgba(91,141,239,0.05)", borderRadius: "20px", border: "0.5px solid rgba(91,141,239,0.18)", maxWidth: "700px", margin: "4rem auto 0" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.6 }}>
              "The patient uploads a photo. The clinician opens their calendar and the appointment is already there. <span className="grad">Zero human clicks.</span>"
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--aura-slate)", marginTop: "1rem", fontFamily: "var(--mono)" }}>— MedOrchestrator AI · 33 second pipeline · 0 human touchpoints</p>
          </div>
        </div>
      </section>

      {/* ── FUTURE ───────────────────────────────────────────────────────── */}
      <section id="future" style={{ padding: "8rem 5rem", background: "var(--aura-bg)" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div className="section-label">The Horizon</div>
          <h2 className="section-h2">Healthcare<br /><span className="grad">reimagined</span></h2>
          <p className="section-p" style={{ margin: "0 auto", textAlign: "center" }}>
            We're not building a product. We're building the infrastructure for a world where AI continuously protects every human life.
          </p>
        </div>
        <div className="future-grid">
          {futureCards.map((f) => (
            <div key={f.title} className="future-card glass-card">
              <div className="future-icon">{f.icon}</div>
              <div className="future-title">{f.title}</div>
              <div className="future-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section id="cta" style={{ padding: "10rem 5rem", textAlign: "center", position: "relative", overflow: "hidden", background: "linear-gradient(180deg, var(--aura-surface) 0%, var(--aura-bg) 100%)" }}>
        <div className="cta-bg" />
        {/* Rings */}
        {[300, 450, 600].map((size, i) => (
          <div key={i} className="cta-ring" style={{ width: size, height: size, opacity: 0.06 - i * 0.015, animationDelay: `${i * 0.8}s` }} />
        ))}

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="section-label" style={{ display: "inline-flex", marginBottom: "2rem" }}>Ready to Begin</div>
          <h2 className="cta-h2">
            The Future of<br />Healthcare <span className="grad">Starts Now</span>
          </h2>
          <p className="cta-sub">
            Experience autonomous AI-powered healthcare designed to continuously understand, monitor, and improve your well-being — from this moment forward.
          </p>
          <div className="cta-btn-wrap">
            <a href="/dashboard" className="cta-btn">
              ✦ Let's Begin
            </a>
          </div>
          <div style={{ marginTop: "3rem", display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
            {["No credit card required", "HIPAA Compliant", "5 AI agents active instantly"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--aura-slate)" }}>
                <span style={{ color: "var(--aura-primary)" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">MedOrchestrator AI</div>
        <div className="footer-copy">© 2025 MedOrchestrator AI · Built on AWS Bedrock · Powered by autonomous multi-agent intelligence</div>
      </footer>
    </>
  );
}
