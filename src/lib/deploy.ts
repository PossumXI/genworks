import api from './api';

export interface DeploymentConfig {
  provider: 'netlify';
  buildCommand: string;
  outputDir: string;
  environmentVariables: Record<string, string>;
}

export interface DeploymentStatus {
  status: 'queued' | 'building' | 'ready' | 'error';
  url?: string;
  error?: string;
  logs?: string[];
}

export const deployProject = async (config: DeploymentConfig): Promise<string> => {
  try {
    const { data } = await api.post('/deploy', config);
    return data.deploymentId;
  } catch (error) {
    throw new Error('Failed to initiate deployment');
  }
};

export const getDeploymentStatus = async (deploymentId: string): Promise<DeploymentStatus> => {
  try {
    const { data } = await api.get(`/deploy/${deploymentId}/status`);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch deployment status');
  }
};

export const getDeploymentLogs = async (deploymentId: string): Promise<string[]> => {
  try {
    const { data } = await api.get(`/deploy/${deploymentId}/logs`);
    return data.logs;
  } catch (error) {
    throw new Error('Failed to fetch deployment logs');
  }
};