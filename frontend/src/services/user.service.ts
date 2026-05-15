import apiClient from '../lib/api-client';
import { Patient } from '../types';

class UserService {
  async getProfile(): Promise<Patient> {
    const { data } = await apiClient.get('/user/profile');
    return data;
  }

  async updateProfile(profileData: Partial<Patient>): Promise<Patient> {
    const { data } = await apiClient.patch('/user/profile', profileData);
    return data;
  }

  async getHealthSummary() {
    const { data } = await apiClient.get('/user/health-summary');
    return data;
  }
}

export const userService = new UserService();
