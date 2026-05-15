export interface Patient {
  id: string;
  name: string;
  age: number;
  dob: string;
  bloodType: string;
  weight: string;
  height: string;
  location: string;
  physician: string;
  lastVisit: string;
  nextVisit: string;
  insuranceId: string;
  avatar?: string;
  conditions: { name: string; status: string; severity: string; since: string }[];
  medications: { name: string; dosage: string; for: string; refillDate: string; status: string }[];
  history: { date: string; type: string; provider: string; summary: string; hasReport: boolean }[];
  allergies: { allergen: string; reaction: string; severity: string }[];
}

export interface VitalSign {
  id: string;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'critical' | 'low';
  trend: 'up' | 'down' | 'stable';
  history: { timestamp: string; value: number }[];
}

export interface HealthMetric {
  score: number;
  label: string;
  change: number;
  status: 'improved' | 'stable' | 'declining';
}

export interface AIAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'resolved' | 'escalated';
  source: string;
  actionTaken?: string;
}

export interface AgentInsight {
  id: string;
  agentId: string;
  timestamp: string;
  type: 'diagnostic' | 'recommendation' | 'alert' | 'update';
  content: string;
  confidence?: number;
  metadata?: any;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  time: string;
  type: 'appointment' | 'medication' | 'lab' | 'followup';
  status: 'pending' | 'completed' | 'missed';
  provider?: string;
  location?: string;
}

export interface GenomicVariant {
  gene: string;
  rsid: string;
  classification: string;
  condition: string;
  zygosity: string;
}

export interface DiagnosticAnalysis {
  id: string;
  date: string;
  type: string;
  input: string;
  findings: string[];
  confidence: number;
  status: string;
  severity: string;
  aiModel: string;
}
