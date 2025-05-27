import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GitBranch, Calendar, Code, ArrowLeft, CheckCircle } from 'lucide-react';

import { testSuggestionApi, analysisApi } from '../../services/api';
import TestSuggestionItem from './TestSuggestionItem';

const TestSuggestionList = () => {
  const { analysisId } = useParams();
  
  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => analysisApi.getById(analysisId)
  });
  
  const { data: testSuggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['testSuggestions', 'analysis', analysisId],
    queryFn: () => testSuggestionApi.getByAnalysis(analysisId),
    enabled: !!analysisId
  });
  
  if (analysisLoading || suggestionsLoading) {
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
        <h1>Test Suggestions</h1>
        <Link 
          to={`/analyses/${analysisId}`} 
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} />
          Back to Analysis
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Analysis Information</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 p-4">
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
              <code>{analysis.commitHash.substring(0, 8)}</code>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Generated Test Suggestions</h2>
        </div>
        
        {testSuggestions && testSuggestions.length > 0 ? (
          <div>
            {testSuggestions.map(suggestion => (
              <TestSuggestionItem 
                key={suggestion.id} 
                suggestion={suggestion} 
              />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <div className="mb-4">
              <Code size={48} className="mx-auto text-gray-400" />
            </div>
            <p className="mb-4">No test suggestions found for this analysis.</p>
            <Link to={`/analyses/${analysisId}`} className="btn btn-primary">
              <CheckCircle size={16} />
              Generate Test Suggestions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSuggestionList;
