import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';

import { riskConfigApi, repositoryApi } from '../../services/api';
import RiskConfigForm from './RiskConfigForm';

const RiskConfigList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const repositoryId = queryParams.get('repositoryId');
  
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const queryClient = useQueryClient();
  
  const { data: repositories, isLoading: reposLoading } = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryApi.getAll
  });
  
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(repositoryId || '');
  
  const { data: riskConfigs, isLoading: configsLoading } = useQuery({
    queryKey: ['riskConfigs', 'repository', selectedRepositoryId],
    queryFn: () => riskConfigApi.getByRepository(selectedRepositoryId),
    enabled: !!selectedRepositoryId
  });
  
  const deleteMutation = useMutation({
    mutationFn: riskConfigApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskConfigs', 'repository', selectedRepositoryId] });
    }
  });
  
  const handleRepositoryChange = (e) => {
    setSelectedRepositoryId(e.target.value);
  };
  
  const handleEdit = (config) => {
    setEditingConfig(config);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this risk configuration?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditingConfig(null);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingConfig(null);
    queryClient.invalidateQueries({ queryKey: ['riskConfigs', 'repository', selectedRepositoryId] });
  };
  
  if (reposLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Risk Configurations</h1>
        {selectedRepositoryId && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Risk Configuration
          </button>
        )}
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Select Repository</h2>
        </div>
        <div className="p-4">
          <div className="form-group">
            <label className="form-label" htmlFor="repositoryId">Repository</label>
            <select
              id="repositoryId"
              className="form-control"
              value={selectedRepositoryId}
              onChange={handleRepositoryChange}
            >
              <option value="">-- Select a repository --</option>
              {repositories?.map(repo => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {showForm && selectedRepositoryId && (
        <div className="card mb-4">
          <RiskConfigForm 
            config={editingConfig} 
            repositoryId={selectedRepositoryId}
            onClose={handleFormClose} 
            onSubmit={handleFormSubmit} 
          />
        </div>
      )}
      
      {selectedRepositoryId && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Risk Configurations</h2>
          </div>
          
          {configsLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
            </div>
          ) : riskConfigs && riskConfigs.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Risk Weight</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskConfigs.map(config => (
                  <tr key={config.id}>
                    <td>
                      <code>{config.areaPattern}</code>
                    </td>
                    <td>{config.riskWeight.toFixed(1)}</td>
                    <td>{config.description}</td>
                    <td>
                      <span className={`badge ${config.active ? 'badge-success' : 'badge-warning'}`}>
                        {config.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleEdit(config)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(config.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} />
                <span>No risk configurations found for this repository.</span>
              </div>
              <p className="mb-4">
                Risk configurations help identify areas of code that require special attention during testing.
                Add a configuration to define patterns that match high-risk code areas.
              </p>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={16} />
                Add Risk Configuration
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskConfigList;
