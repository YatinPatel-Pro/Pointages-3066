import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import FilterBar from '../components/Filters/FilterBar';

const { FiDownload, FiFilter, FiCalendar, FiTrendingUp } = FiIcons;

function Reports() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [filters, setFilters] = useState({
    collaboratorId: '',
    projectId: '',
    clientId: '',
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'heures', direction: 'desc' });
  const [chartData, setChartData] = useState({
    collaboratorData: [],
    projectData: [],
    occupationData: []
  });
  
  useEffect(() => {
    // Filter time entries based on filters
    let timeEntries = [...state.timeEntries];
    
    if (filters.collaboratorId) {
      timeEntries = timeEntries.filter(entry => entry.collaboratorId === parseInt(filters.collaboratorId));
    }
    
    if (filters.projectId) {
      timeEntries = timeEntries.filter(entry => entry.projectId === parseInt(filters.projectId));
    }
    
    if (filters.clientId) {
      const clientProjects = state.projects
        .filter(project => project.clientId === parseInt(filters.clientId))
        .map(project => project.id);
      timeEntries = timeEntries.filter(entry => clientProjects.includes(entry.projectId));
    }
    
    if (filters.startDate) {
      timeEntries = timeEntries.filter(entry => entry.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      timeEntries = timeEntries.filter(entry => entry.date <= filters.endDate);
    }
    
    // Generate collaborator data
    const collaboratorData = state.collaborators.map(collaborator => {
      const collaboratorEntries = timeEntries.filter(entry => entry.collaboratorId === collaborator.id);
      const totalHours = collaboratorEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const revenue = totalHours * collaborator.hourlyRate;
      return {
        name: collaborator.name,
        heures: totalHours,
        revenus: revenue
      };
    }).filter(item => item.heures > 0);
    
    // Generate project data
    const projectData = state.projects.map(project => {
      const projectEntries = timeEntries.filter(entry => entry.projectId === project.id);
      const totalHours = projectEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const client = state.clients.find(c => c.id === project.clientId);
      return {
        name: project.name,
        client: client?.name,
        heures: totalHours,
        budget: project.budget,
        progression: project.daysConsumed / project.daysAllocated * 100
      };
    }).filter(item => item.heures > 0);
    
    // Generate occupation data
    const occupationData = state.collaborators.map(collaborator => {
      const collaboratorEntries = timeEntries.filter(entry => entry.collaboratorId === collaborator.id);
      const totalHours = collaboratorEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const workingDays = 22; // Moyenne mensuelle
      const maxHours = workingDays * 8;
      const occupation = (totalHours / maxHours) * 100;
      return {
        name: collaborator.name,
        occupation: Math.round(occupation),
        heures: totalHours
      };
    }).filter(item => item.heures > 0);
    
    // Apply sorting to all datasets
    [collaboratorData, projectData, occupationData].forEach(dataset => {
      dataset.sort((a, b) => {
        const aValue = a[sortConfig.key] || 0;
        const bValue = b[sortConfig.key] || 0;
        
        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    });
    
    setChartData({
      collaboratorData,
      projectData,
      occupationData
    });
  }, [state, filters, sortConfig]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  const monthlyTrend = [
    { month: 'Jan', heures: 180, revenus: 22500 },
    { month: 'Fév', heures: 165, revenus: 20625 },
    { month: 'Mar', heures: 195, revenus: 24375 },
    { month: 'Avr', heures: 172, revenus: 21500 },
    { month: 'Mai', heures: 188, revenus: 23500 },
    { month: 'Jun', heures: 205, revenus: 25625 }
  ];

  const exportReport = () => {
    // Logique d'export (CSV, PDF, etc.)
    alert('Fonctionnalité d\'export en cours de développement');
  };
  
  // Filter options for the filter bar
  const filterOptions = {
    hasDateFilter: true,
    collaboratorOptions: state.collaborators,
    projectOptions: state.projects,
    clientOptions: state.clients
  };
  
  // Sort options
  const sortOptions = [
    { key: 'heures', label: 'Heures' },
    { key: 'revenus', label: 'Revenus' },
    { key: 'name', label: 'Nom' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h1>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} />
            <span>Exporter</span>
          </button>
        </div>
      </div>
      
      {/* FilterBar Component */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        sortOptions={sortOptions}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Heures</p>
              <p className="text-2xl font-bold text-gray-900">
                {chartData.collaboratorData.reduce((sum, c) => sum + c.heures, 0)}h
              </p>
            </div>
            <SafeIcon icon={FiCalendar} className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                €{chartData.collaboratorData.reduce((sum, c) => sum + c.revenus, 0).toLocaleString()}
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="text-green-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'Occupation Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {chartData.occupationData.length > 0
                  ? Math.round(chartData.occupationData.reduce((sum, c) => sum + c.occupation, 0) / chartData.occupationData.length)
                  : 0}%
              </p>
            </div>
            <SafeIcon icon={FiFilter} className="text-purple-500 text-2xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {chartData.projectData.length}
              </p>
            </div>
            <SafeIcon icon={FiCalendar} className="text-orange-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité par collaborateur */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité par Collaborateur</h3>
          {chartData.collaboratorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.collaboratorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="heures" fill="#0ea5e9" name="Heures" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300">
              <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Taux d'occupation */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux d'Occupation</h3>
          {chartData.occupationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.occupationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Taux d\'occupation']} />
                <Bar dataKey="occupation" fill="#10b981" name="Occupation %" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300">
              <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Évolution mensuelle */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="heures" stroke="#0ea5e9" name="Heures" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par projet */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Projet</h3>
          {chartData.projectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="heures"
                >
                  {chartData.projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-300">
              <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Tableau détaillé des projets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Détail des Projets</h3>
        </div>
        <div className="overflow-x-auto">
          {chartData.projectData.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heures
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progression
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chartData.projectData.map((project, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.heures}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{project.budget?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(project.progression, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900">
                          {Math.round(project.progression)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucun projet trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;