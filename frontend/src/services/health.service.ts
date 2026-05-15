import apiClient from '../lib/api-client';
import { VitalSign, HealthMetric } from '../types';

class HealthService {
  async getVitals(): Promise<VitalSign[]> {
    const { data } = await apiClient.get('/health/vitals');
    return data;
  }

  async getHealthMetrics(): Promise<HealthMetric[]> {
    const { data } = await apiClient.get('/health/metrics');
    return data;
  }

  async getHistoricalData(metricId: string, timeframe: string) {
    const { data } = await apiClient.get(`/health/history/${metricId}`, {
      params: { timeframe }
    });
    return data;
  }

  async updateVital(vitalId: string, value: number) {
    const { data } = await apiClient.patch(`/health/vitals/${vitalId}`, { value });
    return data;
  }

  async getWellnessScore(): Promise<{
    score: number;
    subScores: { label: string; pct: number; color: string }[];
    recommendation: string;
    weeklyTrend: number[];
  }> {
    const { data } = await apiClient.get('/health/wellness-score');
    return data;
  }
}

export const healthService = new HealthService();
