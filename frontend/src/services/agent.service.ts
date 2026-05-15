import apiClient from '../lib/api-client';
import { 
  AIAlert, 
  AgentInsight, 
  DiagnosticAnalysis, 
  ScheduledEvent,
  GenomicVariant 
} from '../types';

class AgentService {
  // Alerts & Escalation
  async getAlerts(): Promise<AIAlert[]> {
    const { data } = await apiClient.get('/agents/alerts');
    return data;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    await apiClient.post(`/agents/alerts/${alertId}/acknowledge`);
  }

  // Diagnostic Agent
  async getDiagnosticHistory(): Promise<DiagnosticAnalysis[]> {
    const { data } = await apiClient.get('/agents/diagnostic/history');
    return data;
  }

  async runDiagnosis(input: { text: string; image?: File }): Promise<DiagnosticAnalysis> {
    const formData = new FormData();
    formData.append('text', input.text);
    if (input.image) formData.append('image', input.image);

    const { data } = await apiClient.post('/agents/diagnostic/run', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  // Scheduling Agent
  async getSchedule(): Promise<ScheduledEvent[]> {
    const { data } = await apiClient.get('/agents/scheduling/events');
    return data;
  }

  async bookAppointment(eventData: any): Promise<ScheduledEvent> {
    const { data } = await apiClient.post('/agents/scheduling/book', eventData);
    return data;
  }

  // Genomics Agent
  async getGenomicProfile(): Promise<{ 
    summary: any; 
    risks: any[]; 
    traits: any[]; 
    variants: GenomicVariant[] 
  }> {
    const { data } = await apiClient.get('/agents/genomics/profile');
    return data;
  }

  // Chatbot / Q&A
  async getChatHistory(): Promise<any[]> {
    const { data } = await apiClient.get('/agents/qa/history');
    return data;
  }

  async sendChatMessage(message: string): Promise<string> {
    const { data } = await apiClient.post('/agents/qa/query', { message });
    return data.response;
  }
}

export const agentService = new AgentService();
