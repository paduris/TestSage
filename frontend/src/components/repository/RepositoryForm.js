import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';

import { repositoryApi } from '../../services/api';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useApp } from '../../context/AppContext';

const RepositoryForm = ({ repository, onClose, onSubmit }) => {
  const initialState = repository ? { ...repository } : {
    name: '',
    gitUrl: '',
    branch: 'main',
    businessDomain: 'BANKING'
  };
  
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useApp();
  
  const createMutation = useMutation({
    mutationFn: repositoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      notifySuccess('Repository created successfully');
      onSubmit();
    },
    onError: (error) => {
      notifyError(`Failed to create repository: ${error.message}`);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data) => repositoryApi.update(repository.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      notifySuccess('Repository updated successfully');
      onSubmit();
    },
    onError: (error) => {
      notifyError(`Failed to update repository: ${error.message}`);
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Repository name is required';
    }
    
    if (!formData.gitUrl.trim()) {
      newErrors.gitUrl = 'Git URL is required';
    } else if (!isValidUrl(formData.gitUrl)) {
      newErrors.gitUrl = 'Please enter a valid URL';
    }
    
    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (repository) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };
  
  // Business domain options
  const businessDomainOptions = [
    { value: 'BANKING', label: 'Banking' },
    { value: 'FINTECH', label: 'Fintech' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'RETAIL', label: 'Retail' },
    { value: 'OTHER', label: 'Other' }
  ];
  
  return (
    <div>
      <div className="card-header">
        <h2 className="card-title">{repository ? 'Edit Repository' : 'Add Repository'}</h2>
        <button className="btn btn-secondary" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Repository Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        
        <Input
          id="gitUrl"
          name="gitUrl"
          label="Git URL"
          value={formData.gitUrl}
          onChange={handleChange}
          placeholder="https://github.com/username/repo.git"
          error={errors.gitUrl}
          required
        />
        
        <Input
          id="branch"
          name="branch"
          label="Branch"
          value={formData.branch}
          onChange={handleChange}
          placeholder="main"
          error={errors.branch}
          required
        />
        
        <Select
          id="businessDomain"
          name="businessDomain"
          label="Business Domain"
          value={formData.businessDomain}
          onChange={handleChange}
          options={businessDomainOptions}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Helper function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default RepositoryForm;
