import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, GitBranch, Edit, Trash2, RefreshCw, FolderGit2 } from 'lucide-react';

import { repositoryApi } from '../../services/api';
import RepositoryForm from './RepositoryForm';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { ConfirmModal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

const RepositoryList = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRepository, setEditingRepository] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [repositoryToDelete, setRepositoryToDelete] = useState(null);
  const queryClient = useQueryClient();
  const { notifySuccess, notifyError } = useApp();
  
  const { data: repositories, isLoading, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryApi.getAll
  });
  
  const deleteMutation = useMutation({
    mutationFn: repositoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      notifySuccess('Repository deleted successfully');
    },
    onError: (error) => {
      notifyError(`Failed to delete repository: ${error.message}`);
    }
  });
  
  const handleEdit = (repository) => {
    setEditingRepository(repository);
    setShowForm(true);
  };
  
  const handleDelete = (repository) => {
    setRepositoryToDelete(repository);
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (repositoryToDelete) {
      deleteMutation.mutate(repositoryToDelete.id);
    }
  };
  
  const handleFormClose = () => {
    setShowForm(false);
    setEditingRepository(null);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingRepository(null);
    queryClient.invalidateQueries({ queryKey: ['repositories'] });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading repositories..." />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Repositories</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={() => refetch()}
            icon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            icon={<Plus size={16} />}
          >
            Add Repository
          </Button>
        </div>
      </div>
      
      {showForm && (
        <Card className="mb-6" title={editingRepository ? "Edit Repository" : "Add Repository"}>
          <RepositoryForm 
            repository={editingRepository} 
            onClose={handleFormClose} 
            onSubmit={handleFormSubmit} 
          />
        </Card>
      )}
      
      {repositories && repositories.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Domain</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Analyzed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repositories.map(repo => (
                  <tr key={repo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/repositories/${repo.id}`} 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      >
                        <GitBranch size={16} />
                        {repo.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repo.gitUrl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repo.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repo.businessDomain}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {repo.lastAnalyzedAt 
                        ? new Date(repo.lastAnalyzedAt).toLocaleString() 
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(repo)}
                          icon={<Edit size={16} />}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(repo)}
                          icon={<Trash2 size={16} />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No repositories found"
          description="Add a Git repository to start analyzing your code and generating test suggestions."
          icon={<FolderGit2 size={48} className="text-gray-400" />}
          action={() => setShowForm(true)}
          actionText="Add Repository"
        />
      )}
      
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Repository"
        message={`Are you sure you want to delete the repository "${repositoryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default RepositoryList;
