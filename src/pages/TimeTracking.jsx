import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TimeEntryModal from '../components/TimeTracking/TimeEntryModal';
import FilterBar from '../components/Filters/FilterBar';

const { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiClock, FiEye } = FiIcons;

function TimeTracking() {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    projectId: '',
    collaboratorId: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filteredEntries, setFilteredEntries] = useState([]);
  
  useEffect(() => {
    let entries = [...state.timeEntries];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      entries = entries.filter(entry => {
        const project = state.projects.find(p => p.id === entry.projectId);
        const collaborator = state.collaborators.find(c => c.id === entry.collaboratorId);
        return (
          (project && project.name.toLowerCase().includes(search)) ||
          (collaborator && collaborator.name.toLowerCase().includes(search)) ||
          entry.description.toLowerCase().includes(search)
        );
      });
    }
    
    // Apply status filter
    if (filters.status) {
      entries = entries.filter(entry => entry.status === filters.status);
    }
    
    // Apply date filters
    if (filters.startDate) {
      entries = entries.filter(entry => entry.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      entries = entries.filter(entry => entry.date <= filters.endDate);
    }
    
    // Apply project filter
    if (filters.projectId) {
      entries = entries.filter(entry => entry.projectId === parseInt(filters.projectId));
    }
    
    // Apply collaborator filter
    if (filters.collaboratorId) {
      entries = entries.filter(entry => entry.collaboratorId === parseInt(filters.collaboratorId));
    }
    
    // Apply sorting
    entries.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'date':
          aValue = a.date;
          bValue = b.date;
          break;
        case 'hours':
          aValue = a.hours;
          bValue = b.hours;
          break;
        case 'collaborator':
          const collaboratorA = state.collaborators.find(c => c.id === a.collaboratorId);
          const collaboratorB = state.collaborators.find(c => c.id === b.collaboratorId);
          aValue = collaboratorA?.name || '';
          bValue = collaboratorB?.name || '';
          break;
        case 'project':
          const projectA = state.projects.find(p => p.id === a.projectId);
          const projectB = state.projects.find(p => p.id === b.projectId);
          aValue = projectA?.name || '';
          bValue = projectB?.name || '';
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredEntries(entries);
  }, [state.timeEntries, filters, sortConfig, state.projects, state.collaborators]);

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      actions.deleteTimeEntry(id);
    }
  };

  const handleValidate = (id) => {
    const entry = state.timeEntries.find(e => e.id === id);
    actions.updateTimeEntry({ ...entry, status: 'validated' });
  };

  const handleReject = (id) => {
    const entry = state.timeEntries.find(e => e.id === id);
    actions.updateTimeEntry({ ...entry, status: 'rejected' });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      validated: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: 'En attente',
      validated: 'Validé',
      rejected: 'Rejeté'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Filter options for the filter bar
  const filterOptions = {
    hasDateFilter: true,
    statusOptions: [
      { value: 'pending', label: 'En attente' },
      { value: 'validated', label: 'Validé' },
      { value: 'rejected', label: 'Rejeté' }
    ],
    projectOptions: state.projects,
    collaboratorOptions: state.collaborators
  };

  // Sort options
  const sortOptions = [
    { key: 'date', label: 'Date' },
    { key: 'hours', label: 'Heures' },
    { key: 'collaborator', label: 'Collaborateur' },
    { key: 'project', label: 'Projet' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Pointages</h1>
        <button
          onClick={() => {
            setEditingEntry(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Nouveau Pointage</span>
        </button>
      </div>

      {/* FilterBar Component */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        onSearch={true}
        sortOptions={sortOptions}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      {/* Time Entries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Collaborateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => {
                const collaborator = state.collaborators.find(c => c.id === entry.collaboratorId);
                const project = state.projects.find(p => p.id === entry.projectId);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 text-sm font-medium">
                            {collaborator?.name?.charAt(0)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {collaborator?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <SafeIcon icon={FiClock} className="text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{entry.hours}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(entry.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {entry.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleValidate(entry.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Valider"
                            >
                              <SafeIcon icon={FiCheck} />
                            </button>
                            <button
                              onClick={() => handleReject(entry.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Rejeter"
                            >
                              <SafeIcon icon={FiX} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Modifier"
                        >
                          <SafeIcon icon={FiEdit2} />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Supprimer"
                        >
                          <SafeIcon icon={FiTrash2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucun pointage trouvé</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TimeEntryModal
          entry={editingEntry}
          onClose={() => setIsModalOpen(false)}
          onSave={(entry) => {
            if (editingEntry) {
              actions.updateTimeEntry(entry);
            } else {
              actions.addTimeEntry(entry);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default TimeTracking;