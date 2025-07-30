import React from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { FiUsers, FiFolderPlus, FiClock, FiDollarSign, FiTrendingUp, FiTrendingDown } = FiIcons;

function Dashboard() {
  const { state } = useApp();
  
  const stats = [
    {
      title: 'Collaborateurs Actifs',
      value: state.collaborators.filter(c => c.status === 'active').length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Projets en Cours',
      value: state.projects.filter(p => p.status === 'en_cours').length,
      icon: FiFolderPlus,
      color: 'bg-green-500',
      change: '+1',
      trend: 'up'
    },
    {
      title: 'Heures ce Mois',
      value: state.timeEntries.reduce((sum, entry) => sum + entry.hours, 0),
      icon: FiClock,
      color: 'bg-purple-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'CA Prévisionnel',
      value: '€125,450',
      icon: FiDollarSign,
      color: 'bg-orange-500',
      change: '+8%',
      trend: 'up'
    }
  ];

  const monthlyData = [
    { month: 'Jan', heures: 180, revenus: 22500 },
    { month: 'Fév', heures: 165, revenus: 20625 },
    { month: 'Mar', heures: 195, revenus: 24375 },
    { month: 'Avr', heures: 172, revenus: 21500 },
    { month: 'Mai', heures: 188, revenus: 23500 },
    { month: 'Jun', heures: 205, revenus: 25625 }
  ];

  const projectData = state.projects.map(project => ({
    name: project.name,
    consommé: project.daysConsumed,
    restant: project.daysRemaining
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <SafeIcon 
                    icon={stat.trend === 'up' ? FiTrendingUp : FiTrendingDown} 
                    className={`text-sm mr-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} 
                  />
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <SafeIcon icon={stat.icon} className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="heures" fill="#0ea5e9" name="Heures" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avancement des Projets</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="consommé" stackId="a" fill="#10b981" name="Jours consommés" />
              <Bar dataKey="restant" stackId="a" fill="#e5e7eb" name="Jours restants" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {state.timeEntries.slice(0, 5).map((entry) => {
              const collaborator = state.collaborators.find(c => c.id === entry.collaboratorId);
              const project = state.projects.find(p => p.id === entry.projectId);
              return (
                <div key={entry.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiClock} className="text-primary-600 text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {collaborator?.name} - {project?.name}
                      </p>
                      <p className="text-xs text-gray-500">{entry.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{entry.hours}h</p>
                    <p className="text-xs text-gray-500">{entry.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;