import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GitBranch, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

import { repositoryApi, analysisApi } from '../services/api';
import Card from './common/Card';
import Button from './common/Button';
import LoadingSpinner from './common/LoadingSpinner';
import EmptyState from './common/EmptyState';
import Badge from './common/Badge';

const Dashboard = () => {
  const { data: repositories, isLoading: reposLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryApi.getAll
  });
  
  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: analysisApi.getAll
  });
  
  if (reposLoading || analysesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    );
  }
  
  // Calculate statistics
  const totalRepositories = repositories?.length || 0;
  const totalAnalyses = analyses?.length || 0;
  const averageRiskScore = analyses?.length 
    ? analyses.reduce((sum, analysis) => sum + (analysis.riskScore || 0), 0) / analyses.length 
    : 0;
  
  // Prepare chart data
  const chartData = repositories?.map(repo => {
    const repoAnalyses = analyses?.filter(analysis => analysis.repository.id === repo.id) || [];
    const latestAnalysis = repoAnalyses.length 
      ? repoAnalyses.sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate))[0] 
      : null;
    
    return {
      name: repo.name,
      riskScore: latestAnalysis?.riskScore || 0
    };
  }) || [];
  
  // Get recent analyses
  const recentAnalyses = analyses
    ?.sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate))
    .slice(0, 5) || [];
    
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex flex-col p-2">
            <div className="text-sm font-medium text-blue-600 mb-1">Total Repositories</div>
            <div className="text-3xl font-bold text-gray-800">{totalRepositories}</div>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <GitBranch size={16} className="text-blue-600" />
              <span className="ml-2">Monitored projects</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex flex-col p-2">
            <div className="text-sm font-medium text-green-600 mb-1">Total Analyses</div>
            <div className="text-3xl font-bold text-gray-800">{totalAnalyses}</div>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <CheckCircle size={16} className="text-green-600" />
              <span className="ml-2">Completed scans</span>
            </div>
          </div>
        </Card>
        
        <Card className={`bg-gradient-to-r ${getRiskScoreGradient(averageRiskScore)}`}>
          <div className="flex flex-col p-2">
            <div className={`text-sm font-medium ${getRiskScoreTextColor(averageRiskScore)} mb-1`}>Average Risk Score</div>
            <div className="text-3xl font-bold text-gray-800">{averageRiskScore.toFixed(2)}</div>
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <AlertTriangle size={16} className={getRiskScoreTextColor(averageRiskScore)} />
              <span className="ml-2">Across all repositories</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card 
        title="Risk Score by Repository" 
        className="mb-6"
      >
        {chartData.length > 0 ? (
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}`, 'Risk Score']}
                  contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0' }}
                />
                <Bar 
                  dataKey="riskScore" 
                  fill="#3b82f6" 
                  name="Risk Score"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState
            title="No data available"
            description="Add repositories and analyze them to see risk scores."
            icon={<AlertTriangle size={36} className="text-yellow-500" />}
          />
        )}
      </Card>
      
      <Card 
        title="Recent Analyses" 
        headerClassName="flex justify-between items-center"
        headerRight={
          <Link to="/repositories">
            <Button variant="outline-primary" size="sm" icon={<ArrowRight size={16} />}>
              View All Repositories
            </Button>
          </Link>
        }
      >
        {recentAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repository</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAnalyses.map(analysis => (
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

// Helper functions for risk score styling
const getRiskScoreGradient = (score) => {
  if (!score && score !== 0) return 'from-gray-50 to-gray-100 border-gray-200';
  if (score >= 70) return 'from-red-50 to-red-100 border-red-200';
  if (score >= 40) return 'from-yellow-50 to-yellow-100 border-yellow-200';
  return 'from-green-50 to-green-100 border-green-200';
};

const getRiskScoreTextColor = (score) => {
  if (!score && score !== 0) return 'text-gray-600';
  if (score >= 70) return 'text-red-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-green-600';
};

export default Dashboard;
