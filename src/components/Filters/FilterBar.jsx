import React from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFilter, FiSearch, FiX, FiChevronDown, FiCalendar, FiUser, FiFolder, FiUsers, FiBriefcase } = FiIcons;

function FilterBar({ filters, setFilters, options = {}, onSearch, sortOptions = [], sortConfig, onSortChange }) {
  const clearFilters = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach(key => {
      clearedFilters[key] = '';
    });
    setFilters(clearedFilters);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key, direction) => {
    onSortChange({ key, direction });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search bar */}
        {onSearch && (
          <div className="relative w-full md:w-64 lg:w-72">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Date range */}
        {options.hasDateFilter && (
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <SafeIcon icon={FiCalendar} className="text-gray-500" />
              <span className="text-sm text-gray-700">Du</span>
            </div>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-700">au</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Status filter */}
        {options.statusOptions && (
          <div className="w-full sm:w-auto">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
            >
              <option value="">Tous les statuts</option>
              {options.statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Contract Type filter */}
        {options.contractTypeOptions && (
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <SafeIcon icon={FiBriefcase} className="text-gray-500" />
              <select
                value={filters.contractType || ''}
                onChange={(e) => handleFilterChange('contractType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="">Tous les types de contrat</option>
                {options.contractTypeOptions.map((contractType) => (
                  <option key={contractType.value} value={contractType.value}>
                    {contractType.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Project filter */}
        {options.projectOptions && (
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <SafeIcon icon={FiFolder} className="text-gray-500" />
              <select
                value={filters.projectId || ''}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="">Tous les projets</option>
                {options.projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Client filter */}
        {options.clientOptions && (
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <SafeIcon icon={FiUsers} className="text-gray-500" />
              <select
                value={filters.clientId || ''}
                onChange={(e) => handleFilterChange('clientId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="">Tous les clients</option>
                {options.clientOptions.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Collaborator filter */}
        {options.collaboratorOptions && (
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <SafeIcon icon={FiUser} className="text-gray-500" />
              <select
                value={filters.collaboratorId || ''}
                onChange={(e) => handleFilterChange('collaboratorId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                <option value="">Tous les collaborateurs</option>
                {options.collaboratorOptions.map((collaborator) => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Sort options */}
        {sortOptions.length > 0 && (
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Trier par:</span>
              <select
                value={`${sortConfig?.key || 'date'}-${sortConfig?.direction || 'desc'}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split('-');
                  handleSort(key, direction);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              >
                {sortOptions.map((option) => (
                  <React.Fragment key={option.key}>
                    <option value={`${option.key}-asc`}>
                      {option.label} (croissant)
                    </option>
                    <option value={`${option.key}-desc`}>
                      {option.label} (décroissant)
                    </option>
                  </React.Fragment>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Clear filters button */}
        <button
          onClick={clearFilters}
          className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <SafeIcon icon={FiX} className="mr-1" />
          <span>Effacer les filtres</span>
        </button>
      </div>

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(filters)
          .filter(([key, value]) => value && key !== 'search')
          .map(([key, value]) => {
            let label = '';
            let displayValue = value;

            if (key === 'status' && options.statusOptions) {
              const status = options.statusOptions.find(s => s.value === value);
              if (status) {
                label = 'Statut';
                displayValue = status.label;
              }
            } else if (key === 'contractType' && options.contractTypeOptions) {
              const contractType = options.contractTypeOptions.find(c => c.value === value);
              if (contractType) {
                label = 'Type de contrat';
                displayValue = contractType.label;
              }
            } else if (key === 'projectId' && options.projectOptions) {
              const project = options.projectOptions.find(p => p.id === parseInt(value));
              if (project) {
                label = 'Projet';
                displayValue = project.name;
              }
            } else if (key === 'clientId' && options.clientOptions) {
              const client = options.clientOptions.find(c => c.id === parseInt(value));
              if (client) {
                label = 'Client';
                displayValue = client.name;
              }
            } else if (key === 'collaboratorId' && options.collaboratorOptions) {
              const collaborator = options.collaboratorOptions.find(c => c.id === parseInt(value));
              if (collaborator) {
                label = 'Collaborateur';
                displayValue = collaborator.name;
              }
            } else if (key === 'startDate') {
              label = 'Date début';
            } else if (key === 'endDate') {
              label = 'Date fin';
            }

            if (label) {
              return (
                <div key={key} className="flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">{label}:</span>
                  <span className="ml-1">{displayValue}</span>
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 text-primary-700 hover:text-primary-900"
                  >
                    <SafeIcon icon={FiX} className="text-xs" />
                  </button>
                </div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}

export default FilterBar;