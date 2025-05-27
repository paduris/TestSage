const API_BASE_URL = 'http://localhost:8080/api';

// Repository API
export const repositoryApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/repositories`);
    if (!response.ok) throw new Error('Failed to fetch repositories');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/repositories/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch repository with id ${id}`);
    return response.json();
  },
  
  create: async (repository) => {
    const response = await fetch(`${API_BASE_URL}/repositories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(repository)
    });
    if (!response.ok) throw new Error('Failed to create repository');
    return response.json();
  },
  
  update: async (id, repository) => {
    const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(repository)
    });
    if (!response.ok) throw new Error(`Failed to update repository with id ${id}`);
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/repositories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete repository with id ${id}`);
    return true;
  }
};

// Code Analysis API
export const analysisApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/analyses`);
    if (!response.ok) throw new Error('Failed to fetch analyses');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch analysis with id ${id}`);
    return response.json();
  },
  
  getByRepository: async (repositoryId) => {
    const response = await fetch(`${API_BASE_URL}/analyses/repository/${repositoryId}`);
    if (!response.ok) throw new Error(`Failed to fetch analyses for repository ${repositoryId}`);
    return response.json();
  },
  
  analyze: async (repositoryId) => {
    const response = await fetch(`${API_BASE_URL}/analyses/repository/${repositoryId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`Failed to analyze repository ${repositoryId}`);
    return response.json();
  },
  
  getRiskAreas: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}/risk-areas`);
    if (!response.ok) throw new Error(`Failed to fetch risk areas for analysis ${analysisId}`);
    return response.json();
  },
  
  generateTests: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/analyses/${analysisId}/generate-tests`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`Failed to generate tests for analysis ${analysisId}`);
    return response.json();
  }
};

// Risk Area Config API
export const riskConfigApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/risk-configs`);
    if (!response.ok) throw new Error('Failed to fetch risk configurations');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/risk-configs/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch risk configuration with id ${id}`);
    return response.json();
  },
  
  getByRepository: async (repositoryId) => {
    const response = await fetch(`${API_BASE_URL}/risk-configs/repository/${repositoryId}`);
    if (!response.ok) throw new Error(`Failed to fetch risk configurations for repository ${repositoryId}`);
    return response.json();
  },
  
  create: async (riskConfig) => {
    const response = await fetch(`${API_BASE_URL}/risk-configs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riskConfig)
    });
    if (!response.ok) throw new Error('Failed to create risk configuration');
    return response.json();
  },
  
  update: async (id, riskConfig) => {
    const response = await fetch(`${API_BASE_URL}/risk-configs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riskConfig)
    });
    if (!response.ok) throw new Error(`Failed to update risk configuration with id ${id}`);
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/risk-configs/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Failed to delete risk configuration with id ${id}`);
    return true;
  }
};

// Test Suggestion API
export const testSuggestionApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/test-suggestions`);
    if (!response.ok) throw new Error('Failed to fetch test suggestions');
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/test-suggestions/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch test suggestion with id ${id}`);
    return response.json();
  },
  
  getByAnalysis: async (analysisId) => {
    const response = await fetch(`${API_BASE_URL}/test-suggestions/analysis/${analysisId}`);
    if (!response.ok) throw new Error(`Failed to fetch test suggestions for analysis ${analysisId}`);
    return response.json();
  },
  
  update: async (id, testSuggestion) => {
    const response = await fetch(`${API_BASE_URL}/test-suggestions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testSuggestion)
    });
    if (!response.ok) throw new Error(`Failed to update test suggestion with id ${id}`);
    return response.json();
  }
};
