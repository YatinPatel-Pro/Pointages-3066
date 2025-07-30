import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import DetailTabs from './DetailTabs';
import FilterBar from '../Filters/FilterBar';

const { FiX, FiEdit2, FiActivity, FiClock, FiFolder, FiUsers, FiUser, FiCalendar, FiDollarSign, FiBriefcase } = FiIcons;

function EntityDetails({ entity, entityType, onClose, onEdit }) {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('activities');
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    status: '',
    projectId: '',
    collaboratorId: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  // Determine what data to show based on entity type
  const renderEntityHeader = () => {
    switch (entityType) {
      case 'project':
        const client = state.clients.find(c => c.id === entity.clientId);
        return (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{entity.name}</h2>
              <p className="text-gray-600">{client?.name}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <SafeIcon icon={FiCalendar} className="mr-1" />
                <span>
                  {new Date(entity.startDate).toLocaleDateString('fr-FR')} - {new Date(entity.endDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onEdit(entity)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-full mr-2"
              >
                <SafeIcon icon={FiEdit2} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>
          </div>
        );
      
      case 'client':
        return (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{entity.name}</h2>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <SafeIcon icon={FiUsers} className="mr-1" />
                <span>{entity.contact}</span>
              </div>
              {entity.phone && (
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <span>{entity.phone}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onEdit(entity)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-full mr-2"
              >
                <SafeIcon icon={FiEdit2} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>
          </div>
        );
      
      case 'collaborator':
        return (
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{entity.name}</h2>
              <p className="text-gray-600">{entity.role}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <SafeIcon icon={FiUser} className="mr-1" />
                <span>{entity.email}</span>
              </div>
              
              {/* Afficher les informations RH */}
              {entity.contractType && (
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <SafeIcon icon={FiBriefcase} className="mr-1" />
                  <span>
                    {entity.contractType}
                    {entity.startDate && ` (depuis le ${new Date(entity.startDate).toLocaleDateString('fr-FR')})`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <SafeIcon icon={FiDollarSign} className="mr-1" />
                <span>{entity.hourlyRate}€/h</span>
                {entity.hoursPerDay && <span className="ml-2">({entity.hoursPerDay}h/jour)</span>}
              </div>
              
              {entity.dailyRate && (
                <div className="flex items-center mt-1 text-sm font-medium text-primary-600">
                  <span>TJM: {entity.dailyRate}€/jour</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onEdit(entity)}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-full mr-2"
              >
                <SafeIcon icon={FiEdit2} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Get related data based on entity type
  const getRelatedTimeEntries = () => {
    let entries = [...state.timeEntries];
    
    // Filter by entity type
    if (entityType === 'project') {
      entries = entries.filter(entry => entry.projectId === entity.id);
    } else if (entityType === 'client') {
      const clientProjects = state.projects.filter(p => p.clientId === entity.id);
      const projectIds = clientProjects.map(p => p.id);
      entries = entries.filter(entry => projectIds.includes(entry.projectId));
    } else if (entityType === 'collaborator') {
      entries = entries.filter(entry => entry.collaboratorId === entity.id);
    }
    
    // Apply filters
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
    
    if (filters.startDate) {
      entries = entries.filter(entry => entry.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      entries = entries.filter(entry => entry.date <= filters.endDate);
    }
    
    if (filters.status) {
      entries = entries.filter(entry => entry.status === filters.status);
    }
    
    if (filters.projectId && entityType !== 'project') {
      entries = entries.filter(entry => entry.projectId === parseInt(filters.projectId));
    }
    
    if (filters.collaboratorId && entityType !== 'collaborator') {
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
    
    return entries;
  };

  const getRelatedProjects = () => {
    let projects = [...state.projects];
    
    // Filter by entity type
    if (entityType === 'client') {
      projects = projects.filter(project => project.clientId === entity.id);
    } else if (entityType === 'collaborator') {
      // Find projects where this collaborator has time entries
      const collaboratorEntries = state.timeEntries.filter(entry => entry.collaboratorId === entity.id);
      const projectIds = [...new Set(collaboratorEntries.map(entry => entry.projectId))];
      projects = projects.filter(project => projectIds.includes(project.id));
    }
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      projects = projects.filter(project => project.name.toLowerCase().includes(search));
    }
    
    if (filters.startDate) {
      projects = projects.filter(project => project.startDate >= filters.startDate);
    }
    
    if (filters.endDate) {
      projects = projects.filter(project => project.endDate <= filters.endDate);
    }
    
    if (filters.status) {
      projects = projects.filter(project => project.status === filters.status);
    }
    
    return projects;
  };

  // Define tabs based on entity type
  const getTabs = () => {
    const tabs = [
      { 
        id: 'activities', 
        label: 'Activités', 
        icon: FiActivity,
        count: getRelatedTimeEntries().length 
      }
    ];

    // Add projects tab for clients and collaborators
    if (entityType === 'client' || entityType === 'collaborator') {
      tabs.push({
        id: 'projects',
        label: 'Projets',
        icon: FiFolder,
        count: getRelatedProjects().length
      });
    }

    // Add finance tab for projects and clients
    if (entityType === 'project' || entityType === 'client') {
      tabs.push({
        id: 'finance',
        label: 'Finance',
        icon: FiDollarSign
      });
    }
    
    // Add HR tab for collaborators
    if (entityType === 'collaborator') {
      tabs.push({
        id: 'hr',
        label: 'RH',
        icon: FiUser
      });
    }

    return tabs;
  };

  // Render filter options based on entity type and active tab
  const getFilterOptions = () => {
    const options = {
      hasDateFilter: true
    };

    if (activeTab === 'activities') {
      options.statusOptions = [
        { value: 'pending', label: 'En attente' },
        { value: 'validated', label: 'Validé' },
        { value: 'rejected', label: 'Rejeté' }
      ];

      if (entityType !== 'project') {
        options.projectOptions = state.projects;
      }

      if (entityType !== 'collaborator') {
        options.collaboratorOptions = state.collaborators;
      }
    } else if (activeTab === 'projects') {
      options.statusOptions = [
        { value: 'en_cours', label: 'En cours' },
        { value: 'termine', label: 'Terminé' },
        { value: 'suspendu', label: 'Suspendu' },
        { value: 'annule', label: 'Annulé' }
      ];

      if (entityType !== 'client') {
        options.clientOptions = state.clients;
      }
    }

    return options;
  };

  // Render sort options based on active tab
  const getSortOptions = () => {
    if (activeTab === 'activities') {
      return [
        { key: 'date', label: 'Date' },
        { key: 'hours', label: 'Heures' }
      ];
    } else if (activeTab === 'projects') {
      return [
        { key: 'name', label: 'Nom' },
        { key: 'startDate', label: 'Date de début' },
        { key: 'endDate', label: 'Date de fin' },
        { key: 'daysRemaining', label: 'Jours restants' }
      ];
    }
    return [];
  };

  // Render the content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'activities':
        const timeEntries = getRelatedTimeEntries();
        return (
          <>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              options={getFilterOptions()}
              onSearch={true}
              sortOptions={getSortOptions()}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
            />
            
            {timeEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {entityType !== 'collaborator' ? 'Collaborateur' : 'Projet'}
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {timeEntries.map(entry => {
                      const collaborator = state.collaborators.find(c => c.id === entry.collaboratorId);
                      const project = state.projects.find(p => p.id === entry.projectId);
                      
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entityType !== 'collaborator' ? collaborator?.name : project?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entry.hours}h
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {entry.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(entry.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucune activité trouvée</p>
              </div>
            )}
          </>
        );
      
      case 'projects':
        const projects = getRelatedProjects();
        return (
          <>
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              options={getFilterOptions()}
              onSearch={true}
              sortOptions={getSortOptions()}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
            />
            
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => {
                  const client = state.clients.find(c => c.id === project.clientId);
                  const progress = Math.round((project.daysConsumed / project.daysAllocated) * 100);
                  
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucun projet trouvé</p>
              </div>
            )}
          </>
        );
      
      case 'finance':
        // Calculate financial data based on entity type
        let totalHours = 0;
        let totalRevenue = 0;
        let financeEntries = [];
        
        if (entityType === 'project') {
          financeEntries = state.timeEntries.filter(entry => entry.projectId === entity.id);
          totalHours = financeEntries.reduce((sum, entry) => sum + entry.hours, 0);
          totalRevenue = totalHours * entity.dailyRate / 8; // Convert hours to days
        } else if (entityType === 'client') {
          const clientProjects = state.projects.filter(p => p.clientId === entity.id);
          clientProjects.forEach(project => {
            const projectEntries = state.timeEntries.filter(entry => entry.projectId === project.id);
            const projectHours = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
            totalHours += projectHours;
            totalRevenue += projectHours * project.dailyRate / 8;
          });
        }
        
        const budgetData = {
          total: entityType === 'project' ? entity.budget : state.projects
            .filter(p => p.clientId === entity.id)
            .reduce((sum, p) => sum + p.budget, 0),
          consumed: totalRevenue,
          remaining: entityType === 'project' 
            ? entity.budget - totalRevenue 
            : state.projects
                .filter(p => p.clientId === entity.id)
                .reduce((sum, p) => sum + p.budget, 0) - totalRevenue
        };
        
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalHours.toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-600">Total des heures</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalRevenue.toLocaleString('fr-FR')}€
                  </div>
                  <div className="text-sm text-gray-600">Chiffre d'affaires</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(totalHours / 8)} jours
                  </div>
                  <div className="text-sm text-gray-600">Jours consommés</div>
                </div>
              </div>
            </div>
            
            {budgetData.total > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Consommation du budget</span>
                      <span>{Math.round((budgetData.consumed / budgetData.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budgetData.consumed >= budgetData.total 
                            ? 'bg-red-500' 
                            : budgetData.consumed >= budgetData.total * 0.8 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`} 
                        style={{ width: `${Math.min((budgetData.consumed / budgetData.total) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="font-semibold text-blue-900">{budgetData.total.toLocaleString('fr-FR')}€</div>
                      <div className="text-blue-600">Budget total</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="font-semibold text-green-900">{budgetData.consumed.toLocaleString('fr-FR')}€</div>
                      <div className="text-green-600">Consommé</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="font-semibold text-gray-900">{budgetData.remaining.toLocaleString('fr-FR')}€</div>
                      <div className="text-gray-600">Restant</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'hr':
        // Afficher les informations RH détaillées du collaborateur
        if (entityType !== 'collaborator') return null;
        
        // Calculer les métriques RH
        const collaboratorEntries = state.timeEntries.filter(entry => entry.collaboratorId === entity.id);
        const totalWorkedHours = collaboratorEntries.reduce((sum, entry) => sum + entry.hours, 0);
        
        // Regrouper les heures par mois
        const monthlyHours = {};
        collaboratorEntries.forEach(entry => {
          const month = entry.date.substring(0, 7); // Format YYYY-MM
          monthlyHours[month] = (monthlyHours[month] || 0) + entry.hours;
        });
        
        // Calculer le nombre de jours depuis l'embauche
        const daysSinceHire = entity.startDate ? 
          Math.floor((new Date() - new Date(entity.startDate)) / (1000 * 60 * 60 * 24)) : 0;
        
        return (
          <div className="space-y-8">
            {/* Informations de contrat */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contrat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">Type de contrat</span>
                    <span className="text-base text-gray-900">{entity.contractType || 'Non défini'}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">Date de début</span>
                    <span className="text-base text-gray-900">
                      {entity.startDate ? new Date(entity.startDate).toLocaleDateString('fr-FR') : 'Non défini'}
                    </span>
                    {entity.startDate && <span className="text-xs text-gray-500 ml-2">({daysSinceHire} jours)</span>}
                  </div>
                  
                  {entity.endDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-1">Date de fin</span>
                      <span className="text-base text-gray-900">
                        {new Date(entity.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">Heures par jour</span>
                    <span className="text-base text-gray-900">{entity.hoursPerDay || 7}h</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">Taux horaire</span>
                    <span className="text-base text-gray-900">{entity.hourlyRate}€/h</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-1">Taux journalier moyen (TJM)</span>
                    <span className="text-base text-primary-600 font-medium">{entity.dailyRate}€/jour</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Statistiques de travail */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de travail</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{totalWorkedHours}h</div>
                  <div className="text-sm text-blue-600">Total des heures pointées</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {Math.round(totalWorkedHours / (entity.hoursPerDay || 7))}
                  </div>
                  <div className="text-sm text-green-600">Jours travaillés</div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {Object.keys(monthlyHours).length}
                  </div>
                  <div className="text-sm text-purple-600">Mois d'activité</div>
                </div>
              </div>
            </div>
            
            {/* Heures mensuelles */}
            {Object.keys(monthlyHours).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition mensuelle des heures</h3>
                <div className="space-y-3">
                  {Object.entries(monthlyHours)
                    .sort(([monthA], [monthB]) => monthB.localeCompare(monthA))
                    .slice(0, 6) // Afficher les 6 derniers mois
                    .map(([month, hours]) => {
                      const [year, monthNum] = month.split('-');
                      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                      
                      return (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{monthName}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${Math.min((hours / (22 * (entity.hoursPerDay || 7))) * 100, 100)}%` }} 
                              />
                            </div>
                            <span className="text-sm font-medium">{hours}h</span>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Helper function to render status badges
  const getStatusBadge = (status) => {
    let styles, label;
    
    if (['pending', 'validated', 'rejected'].includes(status)) {
      styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        validated: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      };
      label = {
        pending: 'En attente',
        validated: 'Validé',
        rejected: 'Rejeté'
      };
    } else {
      styles = {
        en_cours: 'bg-green-100 text-green-800',
        termine: 'bg-blue-100 text-blue-800',
        suspendu: 'bg-yellow-100 text-yellow-800',
        annule: 'bg-red-100 text-red-800',
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        archived: 'bg-red-100 text-red-800'
      };
      label = {
        en_cours: 'En cours',
        termine: 'Terminé',
        suspendu: 'Suspendu',
        annule: 'Annulé',
        active: 'Actif',
        inactive: 'Inactif',
        archived: 'Archivé'
      };
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {label[status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {renderEntityHeader()}
          
          <DetailTabs 
            tabs={getTabs()} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          >
            {renderTabContent()}
          </DetailTabs>
        </div>
      </div>
    </div>
  );
}

export default EntityDetails;