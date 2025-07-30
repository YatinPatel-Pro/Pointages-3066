import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ClientModal from '../components/Clients/ClientModal';
import FilterBar from '../components/Filters/FilterBar';
import EntityDetails from '../components/Details/EntityDetails';

const { FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiBuilding, FiEye } = FiIcons;

function Clients() {
  const { state, actions } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    let clients = [...state.clients];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      clients = clients.filter(client => 
        client.name.toLowerCase().includes(search) ||
        client.contact.toLowerCase().includes(search) ||
        (client.phone && client.phone.includes(search))
      );
    }
    
    // Apply status filter
    if (filters.status) {
      clients = clients.filter(client => client.status === filters.status);
    }
    
    // Apply sorting
    clients.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'contact':
          aValue = a.contact;
          bValue = b.contact;
          break;
        case 'projects':
          aValue = state.projects.filter(p => p.clientId === a.id).length;
          bValue = state.projects.filter(p => p.clientId === b.id).length;
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
    
    setFilteredClients(clients);
  }, [state.clients, filters, sortConfig, state.projects]);

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      actions.deleteClient(id);
    }
  };
  
  const handleViewDetails = (client) => {
    setSelectedClient(client);
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
  
  // Filter options for the filter bar
  const filterOptions = {
    statusOptions: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'archived', label: 'Archivé' }
    ]
  };

  // Sort options
  const sortOptions = [
    { key: 'name', label: 'Nom' },
    { key: 'contact', label: 'Contact' },
    { key: 'projects', label: 'Nombre de projets' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} />
          <span>Nouveau Client</span>
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

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const projectCount = state.projects.filter(p => p.clientId === client.id).length;
          return (
            <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                    <SafeIcon icon={FiBuilding} className="text-primary-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-600">{projectCount} projet(s)</p>
                  </div>
                </div>
                {getStatusBadge(client.status)}
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiMail} className="mr-2 text-gray-400" />
                  <span>{client.contact}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiPhone} className="mr-2 text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-primary-600 hover:text-primary-900 p-1"
                  title="Modifier"
                >
                  <SafeIcon icon={FiEdit2} />
                </button>
                <button
                  onClick={() => handleViewDetails(client)}
                  className="text-gray-600 hover:text-gray-900 p-1"
                  title="Voir détails"
                >
                  <SafeIcon icon={FiEye} />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
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
      
      {filteredClients.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">Aucun client trouvé</p>
        </div>
      )}

      {/* Client Modal */}
      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSave={(client) => {
            if (editingClient) {
              actions.updateClient(client);
            } else {
              actions.addClient(client);
            }
            setIsModalOpen(false);
          }}
        />
      )}
      
      {/* Client Details Modal */}
      {selectedClient && (
        <EntityDetails
          entity={selectedClient}
          entityType="client"
          onClose={() => setSelectedClient(null)}
          onEdit={(client) => {
            setSelectedClient(null);
            setEditingClient(client);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default Clients;