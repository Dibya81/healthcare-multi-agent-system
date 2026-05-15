import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Update CSS variables to light theme
css_replacements = {
    'var(--dark)': 'var(--aura-bg)',
    'var(--dark2)': 'var(--aura-surface)',
    'var(--dark3)': 'var(--aura-bg)',
    'var(--white)': 'var(--text-1)',
    'var(--text)': 'var(--text-2)',
    'var(--muted)': 'var(--text-3)',
    'var(--dim)': 'var(--aura-slate)',
    'var(--cyan)': 'var(--aura-primary)',
    'var(--mint)': 'var(--aura-teal)',
    'background: rgba(8,18,28,0.7)': 'background: var(--aura-glass)',
    'background: rgba(6,16,26,0.88)': 'background: var(--aura-surface)',
    'background:rgba(4,12,20,0.9)': 'background: var(--aura-surface)',
    'background:rgba(8,18,28,0.8)': 'background: var(--aura-glass)',
    'background:rgba(8,18,28,0.6)': 'background: var(--aura-glass)',
    'border: 0.5px solid var(--glass-border)': 'border: 1px solid var(--aura-border)',
    'rgba(255,255,255,0.05)': 'rgba(0,0,0,0.03)',
    'rgba(255,255,255,0.04)': 'rgba(0,0,0,0.02)',
    'rgba(255,255,255,0.15)': 'rgba(0,0,0,0.08)',
    'rgba(0,212,255,0.025)': 'rgba(91,141,239,0.05)',
    'rgba(0,212,255,0.04)': 'rgba(91,141,239,0.05)',
    'rgba(0,212,255,0.05)': 'rgba(91,141,239,0.08)',
    'rgba(0,212,255,0.06)': 'rgba(91,141,239,0.1)',
    'rgba(0,212,255,0.07)': 'rgba(91,141,239,0.12)',
    'rgba(0,212,255,0.1)': 'rgba(91,141,239,0.15)',
    'rgba(0,212,255,0.12)': 'rgba(91,141,239,0.18)',
    'rgba(0,212,255,0.15)': 'rgba(91,141,239,0.2)',
    'rgba(0,212,255,0.2)': 'rgba(91,141,239,0.3)',
    'rgba(0,212,255,0.25)': 'rgba(91,141,239,0.35)',
    'rgba(0,212,255,0.3)': 'rgba(91,141,239,0.4)',
    'rgba(0,212,255,0.35)': 'rgba(91,141,239,0.5)',
    'rgba(0,212,255,0.4)': 'rgba(91,141,239,0.6)',
    'background: rgba(3,10,15,0.75)': 'background: rgba(255,255,255,0.85)',
}

# Apply simple CSS variable renaming first
content = content.replace('--dark: #030A0F;', '--aura-bg: #f5f7ff;\n    --aura-surface: #ffffff;\n    --text-1: #0f172a;\n    --text-2: #475569;\n    --text-3: #94a3b8;\n    --aura-primary: #5b8def;\n    --aura-teal: #2dd4bf;\n    --aura-slate: #64748b;\n    --aura-glass: rgba(255,255,255,0.72);\n    --aura-border: rgba(120,130,180,0.12);\n')

for old, new in css_replacements.items():
    content = content.replace(old, new)

content = content.replace('color: #000', 'color: #fff')

# 2. Update features array
old_features = r'const features = \[.*?\];'
new_features = """const features = [
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
  ];"""
content = re.sub(old_features, new_features, content, flags=re.DOTALL)

# 3. Update Agents section grid
old_agents = r'\{\[\s*\{ icon: "❤️".*?\}\)\}'
new_agents = """{[
              { icon: "📋", name: "Patient Agent", sub: "FHIR & History" },
              { icon: "🔍", name: "Diagnostic Agent", sub: "Imaging Analysis" },
              { icon: "📅", name: "Scheduling Agent", sub: "Slots & Reminders" },
              { icon: "🧬", name: "Genomics Agent", sub: "Variant Pipelines" },
              { icon: "🚨", name: "Alerting Agent", sub: "Escalation" },
              { icon: "💬", name: "Q&A Agent", sub: "Patient Chatbot" },
            ].map((a) => (
              <div key={a.name} className="agent-node">
                <div className="agent-node-icon">{a.icon}</div>
                <div className="agent-node-name">{a.name}</div>
                <div className="agent-node-sub">{a.sub}</div>
              </div>
            ))}"""
content = re.sub(old_agents, new_agents, content, flags=re.DOTALL)

# 4. Update the renderMockup logic simply to handle new mockups
old_mockups = r'const renderMockup = \(type: string\) => \{.*?\n  \};\n\n  return \('
new_mockups = """const renderMockup = (type: string) => {
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

  return ("""
content = re.sub(old_mockups, new_mockups, content, flags=re.DOTALL)

# Adjust grid cols to 6
content = content.replace('gridTemplateColumns: "repeat(5,1fr)"', 'gridTemplateColumns: "repeat(3,1fr)"')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)
