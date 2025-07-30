import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CollaboratorModal from '../components/Collaborators/CollaboratorModal';
import FilterBar from '../components/Filters/FilterBar';
import EntityDetails from '../components/Details/EntityDetails';

const { FiPlus, FiEdit2, FiTrash2, FiMail, FiDollarSign, FiUser, FiEye, FiCalendar, FiBriefcase, FiClock } = FiIcons;

function Collaborators() {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollaborator, setEditingCollaborator] = useState(null);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    contractType: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [filteredCollaborators, setFilteredCollaborators] = useState([]);

  useEffect(() => {
    let collaborators = [...state.collaborators];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      collaborators = collaborators.filter(collaborator =>
        collaborator.name.toLowerCase().includes(search) ||
        collaborator.email.toLowerCase().includes(search) ||
        collaborator.role.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filters.status) {
      collaborators = collaborators.filter(collaborator => collaborator.status === filters.status);
    }
    
    // Apply contract type filter
    if (filters.contractType) {
      collaborators = collaborators.filter(collaborator => 
        collaborator.contractType === filters.contractType
      );
    }

    // Apply sorting
    collaborators.sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'hourlyRate':
          aValue = a.hourlyRate;
          bValue = b.hourlyRate;
          break;
        case 'contractType':
          aValue = a.contractType || '';
          bValue = b.contractType || '';
          break;
        case 'startDate':
          aValue = a.startDate || '';
          bValue = b.startDate || '';
          break;
        case 'hours':
          aValue = state.timeEntries.filter(t => t.collaboratorId === a.id).reduce((sum, entry) => sum + entry.hours, 0);
          bValue = state.timeEntries.filter(t => t.collaboratorId === b.id).reduce((sum, entry) => sum + entry.hours, 0);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCollaborators(collaborators);
  }, [state.collaborators, filters, sortConfig, state.timeEntries]);

  const handleEdit = (collaborator) => {
    setEditingCollaborator(collaborator);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      actions.deleteCollaborator(id);
    }
  };

  const handleViewDetails = (collaborator) => {
    setSelectedCollaborator(collaborator);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    };

    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      archived: 'Archivé'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };
  
  const getContractTypeBadge = (contractType) => {
    const styles = {
      'Alternant': 'bg-purple-100 text-purple-800',
      'CDD': 'bg-yellow-100 text-yellow-800',
      'CDI': 'bg-blue-100 text-blue-800',
      'Freelance': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[contractType] || 'bg-gray-100 text-gray-800'}`}>
        {contractType || 'Non défini'}
      </span>
    );
  };

  // Filter options for the filter bar
  const filterOptions = {
    statusOptions: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'archived', label: 'Archivé' }
    ],
    contractTypeOptions: [
      { value: 'Alternant', label: 'Alternant' },
      { value: 'CDD', label: 'CDD' },
      { value: 'CDI', label: 'CDI' },
      { value: 'Freelance', label: 'Freelance' }
    ]
  };

  // Sort options
  const sortOptions = [
    { key: 'name', label: 'Nom' },
    { key: 'role', label: 'Rôle' },
    { key: 'contractType', label: 'Type de contrat' },
    { key: 'startDate', label: 'Date de début' },
    { key: 'hourlyRate', label: 'Taux horaire' },
    { key: 'hours', label: 'Heures pointées' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Collaborateurs</h1>
        <button
          onClick={() => {
            setEditingCollaborator(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Nouveau Collaborateur</span>
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

      {/* Collaborators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollaborators.map((collaborator) => {
          const timeEntries = state.timeEntries.filter(t => t.collaboratorId === collaborator.id);
          const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
          
          return (
            <div key={collaborator.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <SafeIcon icon={FiUser} className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {collaborator.name}
                    </h3>
                    <p className="text-sm text-gray-600">{collaborator.role}</p>
                  </div>
                </div>
                {getStatusBadge(collaborator.status)}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiMail} className="mr-2 text-gray-400" />
                  <span>{collaborator.email}</span>
                </div>
                
                {collaborator.contractType && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <SafeIcon icon={FiBriefcase} className="mr-2 text-gray-400" />
                      <span>Contrat:</span>
                    </div>
                    <div>{getContractTypeBadge(collaborator.contractType)}</div>
                  </div>
                )}
                
                {collaborator.startDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiCalendar} className="mr-2 text-gray-400" />
                    <span>Du {new Date(collaborator.startDate).toLocaleDateString('fr-FR')}
                    {collaborator.endDate && ` au ${new Date(collaborator.endDate).toLocaleDateString('fr-FR')}`}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <SafeIcon icon={FiClock} className="mr-2 text-gray-400" />
                    <span>{collaborator.hoursPerDay || 7}h / jour</span>
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiDollarSign} className="mr-1 text-gray-400" />
                    <span>{collaborator.hourlyRate}€/h</span>
                  </div>
                </div>
                
                {collaborator.dailyRate && (
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>TJM:</span>
                    <span className="text-primary-600">{collaborator.dailyRate}€/j</span>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{totalHours}h</div>
                    <div className="text-xs text-gray-500">Total pointé</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(collaborator)}
                  className="text-primary-600 hover:text-primary-900 p-1"
                  title="Modifier"
                >
                  <SafeIcon icon={FiEdit2} />
                </button>
                <button
                  onClick={() => handleViewDetails(collaborator)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="Voir détails"
                >
                  <SafeIcon icon={FiEye} />
                </button>
                <button
                  onClick={() => handleDelete(collaborator.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                  title="Supprimer"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCollaborators.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">Aucun collaborateur trouvé</p>
        </div>
      )}

      {/* Collaborator Modal */}
      {isModalOpen && (
        <CollaboratorModal
          collaborator={editingCollaborator}
          onClose={() => setIsModalOpen(false)}
          onSave={(collaborator) => {
            if (editingCollaborator) {
              actions.updateCollaborator(collaborator);
            } else {
              actions.addCollaborator(collaborator);
            }
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Collaborator Details Modal */}
      {selectedCollaborator && (
        <EntityDetails
          entity={selectedCollaborator}
          entityType="collaborator"
          onClose={() => setSelectedCollaborator(null)}
          onEdit={(collaborator) => {
            setSelectedCollaborator(null);
            setEditingCollaborator(collaborator);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default Collaborators;