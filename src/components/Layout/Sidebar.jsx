import React from 'react';
import { NavLink } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, 
  FiClock, 
  FiFolderPlus, 
  FiUsers, 
  FiUser, 
  FiCalendar, 
  FiBarChart3, 
  FiSettings 
} = FiIcons;

const menuItems = [
  { path: '/', icon: FiHome, label: 'Tableau de bord' },
  { path: '/pointages', icon: FiClock, label: 'Pointages' },
  { path: '/projets', icon: FiFolderPlus, label: 'Projets' },
  { path: '/clients', icon: FiUsers, label: 'Clients' },
  { path: '/collaborateurs', icon: FiUser, label: 'Collaborateurs' },
  { path: '/calendrier', icon: FiCalendar, label: 'Calendrier' },
  { path: '/rapports', icon: FiBarChart3, label: 'Rapports' },
  { path: '/parametres', icon: FiSettings, label: 'Paramètres' }
];

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Gestion Pointages</h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
              }`
            }
          >
            <SafeIcon icon={item.icon} className="mr-3 text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;