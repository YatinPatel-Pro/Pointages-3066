import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ProjectModal from '../components/Projects/ProjectModal';
import FilterBar from '../components/Filters/FilterBar';
import EntityDetails from '../components/Details/EntityDetails';

const { FiPlus, FiEdit2, FiTrash2, FiEye, FiCalendar, FiDollarSign } = FiIcons;

function Projects() {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    clientId: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    let projects = [...state.projects];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      projects = projects.filter(project => {
        const client = state.clients.find(c => c.id === project.clientId);
        return (
          project.name.toLowerCase().includes(search) ||
          (client && client.name.toLowerCase().includes(search))
        );
      });
    }
    
    // Apply status filter
    if (filters.status) {
      projects = projects.filter(project => project.status === filters.status);
    }
    
    // Apply date filters
    if (filters.startDate) {
      projects = projects.filter(project => project.startDate >= filters.startDate);
    }
    
    if (filters.endDate) {
      projects = projects.filter(project => project.endDate <= filters.endDate);
    }
    
    // Apply client filter
    if (filters.clientId) {
      projects = projects.filter(project => project.clientId === parseInt(filters.clientId));
    }
    
    // Apply sorting
    projects.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'startDate':
          aValue = a.startDate;
          bValue = b.startDate;
          break;
        case 'endDate':
          aValue = a.endDate;
          bValue = b.endDate;
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'client':
          const clientA = state.clients.find(c => c.id === a.clientId);
          const clientB = state.clients.find(c => c.id === b.clientId);
          aValue = clientA?.name || '';
          bValue = clientB?.name || '';
          break;
        case 'progress':
          aValue = (a.daysConsumed / a.daysAllocated) * 100;
          bValue = (b.daysConsumed / b.daysAllocated) * 100;
          break;
        default:
          aValue = a.startDate;
          bValue = b.startDate;
      }
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredProjects(projects);
  }, [state.projects, filters, sortConfig, state.clients]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      actions.deleteProject(id);
    }
  };
  
  const handleViewDetails = (project) => {
    setSelectedProject(project);
  };

  const getStatusBadge = (status) => {
    const styles = {
      en_cours: 'bg-green-100 text-green-800',
      termine: 'bg-blue-100 text-blue-800',
      suspendu: 'bg-yellow-100 text-yellow-800',
      annule: 'bg-red-100 text-red-800'
    };
    const labels = {
      en_cours: 'En cours',
      termine: 'Terminé',
      suspendu: 'Suspendu',
      annule: 'Annulé'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getProgressPercentage = (project) => {
    if (!project.daysAllocated) return 0;
    return Math.round((project.daysConsumed / project.daysAllocated) * 100);
  };
  
  // Filter options for the filter bar
  const filterOptions = {
    hasDateFilter: true,
    statusOptions: [
      { value: 'en_cours', label: 'En cours' },
      { value: 'termine', label: 'Terminé' },
      { value: 'suspendu', label: 'Suspendu' },
      { value: 'annule', label: 'Annulé' }
    ],
    clientOptions: state.clients
  };

  // Sort options
  const sortOptions = [
    { key: 'name', label: 'Nom' },
    { key: 'startDate', label: 'Date de début' },
    { key: 'endDate', label: 'Date de fin' },
    { key: 'budget', label: 'Budget' },
    { key: 'client', label: 'Client' },
    { key: 'progress', label: 'Progression' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Projets</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Nouveau Projet</span>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const client = state.clients.find(c => c.id === project.clientId);
          const progress = getProgressPercentage(project);
          return (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600">{client?.name}</p>
                </div>
                {getStatusBadge(project.status)}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} className="mr-2" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString('fr-FR')} - {' '}
                    {new Date(project.endDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiDollarSign} className="mr-2" />
                  <span>{project.budget?.toLocaleString('fr-FR')} €</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress >= 100
                          ? 'bg-red-500'
                          : progress >= 80
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-semibold text-blue-900">{project.daysAllocated}</div>
                    <div className="text-blue-600">Alloués</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-semibold text-green-900">{project.daysConsumed}</div>
                    <div className="text-green-600">Consommés</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold text-gray-900">{project.daysRemaining}</div>
                    <div className="text-gray-600">Restants</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(project)}
                  className="text-primary-600 hover:text-primary-900 p-1"
                  title="Modifier"
                >
                  <SafeIcon icon={FiEdit2} />
                </button>
                <button
                  onClick={() => handleViewDetails(project)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="Voir détails"
                >
                  <SafeIcon icon={FiEye} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
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
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">Aucun projet trouvé</p>
        </div>
      )}

      {/* Project Modal */}
      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={() => setIsModalOpen(false)}
          onSave={(project) => {
            if (editingProject) {
              actions.updateProject(project);
            } else {
              actions.addProject(project);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      
      {/* Project Details Modal */}
      {selectedProject && (
        <EntityDetails
          entity={selectedProject}
          entityType="project"
          onClose={() => setSelectedProject(null)}
          onEdit={(project) => {
            setSelectedProject(null);
            setEditingProject(project);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default Projects;