import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Custom hook for repository API
export const useRepositories = () => {
  const queryClient = useQueryClient();
  
  // Get all repositories
  const getRepositories = () => {
    return useQuery({
      queryKey: ['repositories'],
      queryFn: async () => {
        const response = await fetch('/api/repositories');
        if (!response.ok) throw new Error('Failed to fetch repositories');
        return response.json();
      }
    });
  };
  
  // Get repository by ID
  const getRepository = (id) => {
    return useQuery({
      queryKey: ['repositories', id],
      queryFn: async () => {
        const response = await fetch(`/api/repositories/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch repository with id ${id}`);
        return response.json();
      },
      enabled: !!id
    });
  };
  
  // Create repository
  const createRepository = () => {
    return useMutation({
      mutationFn: async (repository) => {
        const response = await fetch('/api/repositories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repository)
        });
        if (!response.ok) throw new Error('Failed to create repository');
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['repositories'] });
      }
    });
  };
  
  // Update repository
  const updateRepository = () => {
    return useMutation({
      mutationFn: async ({ id, repository }) => {
        const response = await fetch(`/api/repositories/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repository)
        });
        if (!response.ok) throw new Error(`Failed to update repository with id ${id}`);
        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['repositories'] });
        queryClient.invalidateQueries({ queryKey: ['repositories', data.id] });
      }
    });
  };
  
  // Delete repository
  const deleteRepository = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await fetch(`/api/repositories/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Failed to delete repository with id ${id}`);
        return true;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['repositories'] });
      }
    });
  };
  
  return {
    getRepositories,
    getRepository,
    createRepository,
    updateRepository,
    deleteRepository
  };
};

// Custom hook for analysis API
export const useAnalyses = () => {
  const queryClient = useQueryClient();
  
  // Get all analyses
  const getAnalyses = () => {
    return useQuery({
      queryKey: ['analyses'],
      queryFn: async () => {
        const response = await fetch('/api/analyses');
        if (!response.ok) throw new Error('Failed to fetch analyses');
        return response.json();
      }
    });
  };
  
  // Get analysis by ID
  const getAnalysis = (id) => {
    return useQuery({
      queryKey: ['analyses', id],
      queryFn: async () => {
        const response = await fetch(`/api/analyses/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch analysis with id ${id}`);
        return response.json();
      },
      enabled: !!id
    });
  };
  
  // Get analyses by repository
  const getAnalysesByRepository = (repositoryId) => {
    return useQuery({
      queryKey: ['analyses', 'repository', repositoryId],
      queryFn: async () => {
        const response = await fetch(`/api/analyses/repository/${repositoryId}`);
        if (!response.ok) throw new Error(`Failed to fetch analyses for repository ${repositoryId}`);
        return response.json();
      },
      enabled: !!repositoryId
    });
  };
  
  // Create analysis (analyze repository)
  const analyzeRepository = () => {
    return useMutation({
      mutationFn: async (repositoryId) => {
        const response = await fetch(`/api/analyses/repository/${repositoryId}`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error(`Failed to analyze repository ${repositoryId}`);
        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['analyses'] });
        queryClient.invalidateQueries({ queryKey: ['analyses', 'repository', data.repository.id] });
      }
    });
  };
  
  // Get risk areas for analysis
  const getRiskAreas = (analysisId) => {
    return useQuery({
      queryKey: ['analyses', analysisId, 'risk-areas'],
      queryFn: async () => {
        const response = await fetch(`/api/analyses/${analysisId}/risk-areas`);
        if (!response.ok) throw new Error(`Failed to fetch risk areas for analysis ${analysisId}`);
        return response.json();
      },
      enabled: !!analysisId
    });
  };
  
  // Generate tests for analysis
  const generateTests = () => {
    return useMutation({
      mutationFn: async (analysisId) => {
        const response = await fetch(`/api/analyses/${analysisId}/generate-tests`, {
          method: 'POST'
        });
        if (!response.ok) throw new Error(`Failed to generate tests for analysis ${analysisId}`);
        return response.json();
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['test-suggestions', 'analysis', variables] });
      }
    });
  };
  
  return {
    getAnalyses,
    getAnalysis,
    getAnalysesByRepository,
    analyzeRepository,
    getRiskAreas,
    generateTests
  };
};

// Custom hook for risk config API
export const useRiskConfigs = () => {
  const queryClient = useQueryClient();
  
  // Get all risk configs
  const getRiskConfigs = () => {
    return useQuery({
      queryKey: ['risk-configs'],
      queryFn: async () => {
        const response = await fetch('/api/risk-configs');
        if (!response.ok) throw new Error('Failed to fetch risk configurations');
        return response.json();
      }
    });
  };
  
  // Get risk config by ID
  const getRiskConfig = (id) => {
    return useQuery({
      queryKey: ['risk-configs', id],
      queryFn: async () => {
        const response = await fetch(`/api/risk-configs/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch risk configuration with id ${id}`);
        return response.json();
      },
      enabled: !!id
    });
  };
  
  // Get risk configs by repository
  const getRiskConfigsByRepository = (repositoryId) => {
    return useQuery({
      queryKey: ['risk-configs', 'repository', repositoryId],
      queryFn: async () => {
        const response = await fetch(`/api/risk-configs/repository/${repositoryId}`);
        if (!response.ok) throw new Error(`Failed to fetch risk configurations for repository ${repositoryId}`);
        return response.json();
      },
      enabled: !!repositoryId
    });
  };
  
  // Create risk config
  const createRiskConfig = () => {
    return useMutation({
      mutationFn: async (riskConfig) => {
        const response = await fetch('/api/risk-configs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(riskConfig)
        });
        if (!response.ok) throw new Error('Failed to create risk configuration');
        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['risk-configs'] });
        queryClient.invalidateQueries({ queryKey: ['risk-configs', 'repository', data.repository.id] });
      }
    });
  };
  
  // Update risk config
  const updateRiskConfig = () => {
    return useMutation({
      mutationFn: async ({ id, riskConfig }) => {
        const response = await fetch(`/api/risk-configs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(riskConfig)
        });
        if (!response.ok) throw new Error(`Failed to update risk configuration with id ${id}`);
        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['risk-configs'] });
        queryClient.invalidateQueries({ queryKey: ['risk-configs', data.id] });
        queryClient.invalidateQueries({ queryKey: ['risk-configs', 'repository', data.repository.id] });
      }
    });
  };
  
  // Delete risk config
  const deleteRiskConfig = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await fetch(`/api/risk-configs/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Failed to delete risk configuration with id ${id}`);
        return true;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['risk-configs'] });
      }
    });
  };
  
  return {
    getRiskConfigs,
    getRiskConfig,
    getRiskConfigsByRepository,
    createRiskConfig,
    updateRiskConfig,
    deleteRiskConfig
  };
};

// Custom hook for test suggestion API
export const useTestSuggestions = () => {
  const queryClient = useQueryClient();
  
  // Get all test suggestions
  const getTestSuggestions = () => {
    return useQuery({
      queryKey: ['test-suggestions'],
      queryFn: async () => {
        const response = await fetch('/api/test-suggestions');
        if (!response.ok) throw new Error('Failed to fetch test suggestions');
        return response.json();
      }
    });
  };
  
  // Get test suggestion by ID
  const getTestSuggestion = (id) => {
    return useQuery({
      queryKey: ['test-suggestions', id],
      queryFn: async () => {
        const response = await fetch(`/api/test-suggestions/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch test suggestion with id ${id}`);
        return response.json();
      },
      enabled: !!id
    });
  };
  
  // Get test suggestions by analysis
  const getTestSuggestionsByAnalysis = (analysisId) => {
    return useQuery({
      queryKey: ['test-suggestions', 'analysis', analysisId],
      queryFn: async () => {
        const response = await fetch(`/api/test-suggestions/analysis/${analysisId}`);
        if (!response.ok) throw new Error(`Failed to fetch test suggestions for analysis ${analysisId}`);
        return response.json();
      },
      enabled: !!analysisId
    });
  };
  
  // Update test suggestion
  const updateTestSuggestion = () => {
    return useMutation({
      mutationFn: async ({ id, testSuggestion }) => {
        const response = await fetch(`/api/test-suggestions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testSuggestion)
        });
        if (!response.ok) throw new Error(`Failed to update test suggestion with id ${id}`);
        return response.json();
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['test-suggestions'] });
        queryClient.invalidateQueries({ queryKey: ['test-suggestions', data.id] });
        queryClient.invalidateQueries({ queryKey: ['test-suggestions', 'analysis', data.analysis.id] });
      }
    });
  };
  
  return {
    getTestSuggestions,
    getTestSuggestion,
    getTestSuggestionsByAnalysis,
    updateTestSuggestion
  };
};
