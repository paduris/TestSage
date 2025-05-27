import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { riskConfigApi } from '../../services/api';

const RiskConfigForm = ({ config, repositoryId, onClose, onSubmit }) => {
  const initialState = config ? { ...config } : {
    repositoryId: repositoryId,
    areaPattern: '',
    riskWeight: 1.0,
    description: '',
    active: true
  };
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: riskConfigApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskConfigs', 'repository', repositoryId] });
      onSubmit();
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data) => riskConfigApi.update(config.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskConfigs', 'repository', repositoryId] });
      onSubmit();
    }
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : newValue 
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.areaPattern.trim()) {
      newErrors.areaPattern = 'Pattern is required';
    }
    
    if (formData.riskWeight < 0.1 || formData.riskWeight > 10) {
      newErrors.riskWeight = 'Risk weight must be between 0.1 and 10';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const payload = {
      ...formData,
      repositoryId: parseInt(repositoryId, 10)
    };
    
    if (config) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };
  
  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">{config ? 'Edit Risk Configuration' : 'Add Risk Configuration'}</h2>
        <button className="btn btn-secondary" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="form-group">
          <label className="form-label" htmlFor="areaPattern">Pattern (Regular Expression)</label>
          <input
            type="text"
            id="areaPattern"
            name="areaPattern"
            className="form-control"
            value={formData.areaPattern}
            onChange={handleChange}
            placeholder=".*Payment.*\.java"
          />
          {errors.areaPattern && <div className="text-red-500 mt-1">{errors.areaPattern}</div>}
          <div className="text-gray-500 text-sm mt-1">
            Use regular expressions to match file paths. Example: .*Payment.*\.java
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="riskWeight">Risk Weight</label>
          <input
            type="number"
            id="riskWeight"
            name="riskWeight"
            className="form-control"
            value={formData.riskWeight}
            onChange={handleChange}
            step="0.1"
            min="0.1"
            max="10"
          />
          {errors.riskWeight && <div className="text-red-500 mt-1">{errors.riskWeight}</div>}
          <div className="text-gray-500 text-sm mt-1">
            Higher values indicate higher risk. Range: 0.1 to 10.0
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe why this pattern indicates risk"
          ></textarea>
          {errors.description && <div className="text-red-500 mt-1">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="active">Active</label>
          </div>
          <div className="text-gray-500 text-sm mt-1">
            Inactive configurations won't be used in risk calculations
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RiskConfigForm;
