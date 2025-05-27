import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Code, ChevronDown, ChevronUp, Copy } from 'lucide-react';

import { testSuggestionApi } from '../../services/api';

const TestSuggestionItem = ({ suggestion }) => {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const getPriorityClass = (priority) => {
    switch (priority) {
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
  
  const getTestTypeClass = (testType) => {
    switch (testType) {
      case 'UNIT':
        return 'bg-blue-100 text-blue-800';
      case 'INTEGRATION':
        return 'bg-purple-100 text-purple-800';
      case 'FUNCTIONAL':
        return 'bg-green-100 text-green-800';
      case 'PERFORMANCE':
        return 'bg-orange-100 text-orange-800';
      case 'SECURITY':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge ${getTestTypeClass(suggestion.testType)}`}>
              {suggestion.testType}
            </span>
            <span className={`badge ${getPriorityClass(suggestion.priority)}`}>
              {suggestion.priority} Priority
            </span>
          </div>
          <div className="font-medium">{suggestion.testDescription}</div>
        </div>
        <div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-gray-50">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">Test Code</div>
              <button 
                className="btn btn-secondary"
                onClick={() => copyToClipboard(suggestion.testCode)}
              >
                <Copy size={16} />
                Copy Code
              </button>
            </div>
            <div className="code-block">
              <pre>{suggestion.testCode}</pre>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm">
            Created: {new Date(suggestion.createdAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSuggestionItem;
