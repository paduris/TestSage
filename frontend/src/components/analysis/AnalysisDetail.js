import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GitBranch, Calendar, AlertTriangle, FileCode, Clock, Code, Zap } from 'lucide-react';

import { analysisApi } from '../../services/api';

const AnalysisDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  
  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => analysisApi.getById(id)
  });
  
  const { data: riskAreas, isLoading: riskAreasLoading } = useQuery({
    queryKey: ['riskAreas', id],
    queryFn: () => analysisApi.getRiskAreas(id),
    enabled: !!id
  });
  
  const generateTestsMutation = useMutation({
    mutationFn: () => analysisApi.generateTests(id),
    onMutate: () => {
      setIsGeneratingTests(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testSuggestions', 'analysis', id] });
      setIsGeneratingTests(false);
    },
    onError: () => {
      setIsGeneratingTests(false);
    }
  });
  
  const handleGenerateTests = () => {
    generateTestsMutation.mutate();
  };
  
  if (analysisLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="card">
        <div className="p-4">Analysis not found</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Analysis Details</h1>
        <div className="flex gap-2">
          <Link 
            to={`/repositories/${analysis.repository.id}`} 
            className="btn btn-secondary"
          >
            <GitBranch size={16} />
            Back to Repository
          </Link>
          <button 
            className="btn btn-primary" 
            onClick={handleGenerateTests}
            disabled={isGeneratingTests}
          >
            <Zap size={16} className={isGeneratingTests ? 'animate-pulse' : ''} />
            {isGeneratingTests ? 'Generating...' : 'Generate Test Suggestions'}
          </button>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Analysis Overview</h2>
          <Link to={`/test-suggestions/${id}`} className="btn btn-primary">
            View Test Suggestions
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <div className="text-gray-500 mb-1">Repository</div>
            <div className="flex items-center gap-2">
              <GitBranch size={16} />
              <Link to={`/repositories/${analysis.repository.id}`}>
                {analysis.repository.name}
              </Link>
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Analysis Date</div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(analysis.analysisDate).toLocaleString()}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Commit Hash</div>
            <div>
              <code>{analysis.commitHash}</code>
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Risk Score</div>
            <div className={`text-xl font-bold ${getRiskScoreClass(analysis.riskScore)}`}>
              {analysis.riskScore?.toFixed(2) || 'N/A'}
            </div>
          </div>
          
          <div>
            <div className="text-gray-500 mb-1">Files Changed</div>
            <div className="flex items-center gap-2">
              <FileCode size={16} />
              {analysis.filesChanged || 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Risk Areas</h2>
        </div>
        
        {riskAreasLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : riskAreas && riskAreas.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>File Path</th>
                <th>Line Numbers</th>
                <th>Risk Level</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {riskAreas.map(area => (
                <tr key={area.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileCode size={16} />
                      <code>{area.filePath}</code>
                    </div>
                  </td>
                  <td>
                    <code>{area.lineNumbers}</code>
                  </td>
                  <td>
                    <span className={`badge ${getRiskLevelBadgeClass(area.riskLevel)}`}>
                      {area.riskLevel}
                    </span>
                  </td>
                  <td>{area.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} />
              <span>No risk areas identified in this analysis.</span>
            </div>
          </div>
        )}
      </div>
      
      {analysis.diffContent && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Code Changes</h2>
          </div>
          <div className="p-4">
            <div className="code-block">
              <pre>{analysis.diffContent}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get risk score class
const getRiskScoreClass = (score) => {
  if (!score && score !== 0) return '';
  if (score >= 70) return 'risk-score-high';
  if (score >= 40) return 'risk-score-medium';
  return 'risk-score-low';
};

// Helper function to get risk level badge class
const getRiskLevelBadgeClass = (level) => {
  switch (level) {
    case 'HIGH':
      return 'badge-danger';
    case 'MEDIUM':
      return 'badge-warning';
    case 'LOW':
      return 'badge-success';
    default:
      return '';
  }
};

export default AnalysisDetail;
