import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, GitBranch } from 'lucide-react';

import { analysisApi } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Badge from '../common/Badge';

const AnalysisList = () => {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: analysisApi.getAll
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading analyses..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Code Analyses</h1>
        <Link to="/repositories">
          <Button variant="primary">
            New Analysis
          </Button>
        </Link>
      </div>

      <Card>
        {analyses?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repository</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyses.map(analysis => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <GitBranch size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{analysis.repository.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Clock size={16} className="text-gray-600" />
                        {new Date(analysis.analysisDate).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskScoreBadge score={analysis.riskScore} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={analysis.status === 'COMPLETED' ? 'success' : 'warning'}
                      >
                        {analysis.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/analyses/${analysis.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No analyses found"
            description="Start by analyzing a repository to see results here."
            icon={<AlertTriangle size={36} className="text-yellow-500" />}
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

export default AnalysisList;
