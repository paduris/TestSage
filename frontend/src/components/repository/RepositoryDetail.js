import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GitBranch, Calendar, RefreshCw, AlertTriangle, FileCode, Clock, ArrowLeft, ExternalLink } from 'lucide-react';

import { repositoryApi, analysisApi } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';
import { useApp } from '../../context/AppContext';

const RepositoryDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { notifySuccess, notifyError } = useApp();
  
  const { data: repository, isLoading: repoLoading } = useQuery({
    queryKey: ['repository', id],
    queryFn: () => repositoryApi.getById(id)
  });
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['analyses', 'repository', id],
    queryFn: () => analysisApi.getByRepository(id),
    enabled: !!id
  });
  
  const analyzeMutation = useMutation({
    mutationFn: () => analysisApi.analyze(id),
    onMutate: () => {
      setIsAnalyzing(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses', 'repository', id] });
      queryClient.invalidateQueries({ queryKey: ['repository', id] });
      setIsAnalyzing(false);
      notifySuccess('Repository analysis completed successfully');
    },
    onError: (error) => {
      setIsAnalyzing(false);
      notifyError(`Analysis failed: ${error.message}`);
    }
  });
  
  const handleAnalyze = () => {
    analyzeMutation.mutate();
  };
  
  if (repoLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading repository details..." />
      </div>
    );
  }
  
  if (!repository) {
    return (
      <EmptyState
        title="Repository not found"
        description="The repository you are looking for does not exist or has been deleted."
        action={() => window.history.back()}
        actionText="Go Back"
        icon={<AlertTriangle size={48} className="text-yellow-500" />}
      />
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/repositories" className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Repositories
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">{repository.name}</h1>
        </div>
        <Button 
          variant="primary" 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          icon={<RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
        </Button>
      </div>
      
      <Card 
        title="Repository Details" 
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Git URL</h3>
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-gray-600" />
              <a 
                href={repository.gitUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {repository.gitUrl}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Branch</h3>
            <div className="text-gray-900">{repository.branch}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Business Domain</h3>
            <Badge variant="primary" size="md">
              {repository.businessDomain}
            </Badge>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar size={16} className="text-gray-600" />
              {new Date(repository.createdAt).toLocaleString()}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Analyzed</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock size={16} className="text-gray-600" />
              {repository.lastAnalyzedAt 
                ? new Date(repository.lastAnalyzedAt).toLocaleString() 
                : 'Never'
              }
            </div>
          </div>
        </div>
      </Card>
      
      <Card 
        title="Analysis History" 
        headerClassName="flex justify-between items-center"
        footer={
          <Link to={`/risk-configs?repositoryId=${id}`}>
            <Button variant="outline-primary">
              Risk Configurations
            </Button>
          </Link>
        }
      >
        {analysesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading analyses..." />
          </div>
        ) : analyses && analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commit Hash</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Files Changed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyses.map(analysis => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar size={16} className="text-gray-600" />
                        {new Date(analysis.analysisDate).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {analysis.commitHash.substring(0, 8)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskScoreBadge score={analysis.riskScore} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <FileCode size={16} className="text-gray-600" />
                        {analysis.filesChanged || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link to={`/analyses/${analysis.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/test-suggestions/${analysis.id}`}>
                          <Button variant="primary" size="sm">
                            Test Suggestions
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No analyses found"
            description="No code analyses have been performed for this repository yet."
            icon={<AlertTriangle size={36} className="text-yellow-500" />}
            action={handleAnalyze}
            actionText="Analyze Now"
            actionVariant="primary"
          />
        )}
      </Card>
    </div>
  );
};

// Risk Score Badge component
const RiskScoreBadge = ({ score }) => {
  if (!score && score !== 0) return <span>N/A</span>;
  
  let variant = 'success';
  let label = 'Low';
  
  if (score >= 70) {
    variant = 'danger';
    label = 'High';
  } else if (score >= 40) {
    variant = 'warning';
    label = 'Medium';
  }
  
  return (
    <Badge variant={variant}>
      {score.toFixed(2)} - {label}
    </Badge>
  );
};

export default RepositoryDetail;
