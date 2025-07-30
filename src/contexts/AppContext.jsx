import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  collaborators: [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'Développeur Senior',
      hourlyRate: 65,
      status: 'active',
      contractType: 'CDI',
      startDate: '2022-01-15',
      endDate: '',
      hoursPerDay: 7,
      dailyRate: 455
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: 'Chef de Projet',
      hourlyRate: 75,
      status: 'active',
      contractType: 'CDI',
      startDate: '2021-06-01',
      endDate: '',
      hoursPerDay: 8,
      dailyRate: 600
    },
    {
      id: 3,
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      role: 'Designer UX/UI',
      hourlyRate: 60,
      status: 'active',
      contractType: 'CDD',
      startDate: '2023-03-15',
      endDate: '2024-12-31',
      hoursPerDay: 7.5,
      dailyRate: 450
    }
  ],
  clients: [
    {
      id: 1,
      name: 'TechCorp',
      contact: 'contact@techcorp.com',
      phone: '01 23 45 67 89',
      status: 'active'
    },
    {
      id: 2,
      name: 'StartupXYZ',
      contact: 'hello@startupxyz.com',
      phone: '01 98 76 54 32',
      status: 'active'
    },
    {
      id: 3,
      name: 'Enterprise Solutions',
      contact: 'info@enterprise.com',
      phone: '01 11 22 33 44',
      status: 'active'
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Refonte Site Web',
      clientId: 1,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      budget: 25000,
      dailyRate: 500,
      status: 'en_cours',
      daysAllocated: 50,
      daysConsumed: 23,
      daysRemaining: 27
    },
    {
      id: 2,
      name: 'Application Mobile',
      clientId: 2,
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      budget: 45000,
      dailyRate: 600,
      status: 'en_cours',
      daysAllocated: 75,
      daysConsumed: 15,
      daysRemaining: 60
    }
  ],
  timeEntries: [
    {
      id: 1,
      collaboratorId: 1,
      projectId: 1,
      date: '2024-01-30',
      hours: 8,
      description: 'Développement frontend',
      status: 'validated'
    },
    {
      id: 2,
      collaboratorId: 2,
      projectId: 1,
      date: '2024-01-30',
      hours: 6,
      description: 'Gestion de projet',
      status: 'pending'
    }
  ],
  workingDays: {
    '2024-01-01': false, // Jour férié
    '2024-05-01': false, // Fête du travail
    '2024-07-14': false, // Fête nationale
    '2024-12-25': false, // Noël
  },
  emailTemplate: {
    subject: 'Rappel : Pointage mensuel des activités',
    body: `Bonjour {collaborator_name},

J'espère que vous allez bien. Comme chaque mois, je vous rappelle qu'il est temps de compléter votre pointage d'activités pour le mois écoulé dans notre application CRM.

Merci de bien vouloir :
1. Vous connecter à l'application
2. Saisir vos heures par projet/mission
3. Valider votre pointage avant le {deadline}

En cas de questions, n'hésitez pas à me contacter.

Cordialement,
{sender_name}`
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [...state.collaborators, {...action.payload, id: Date.now()}]
      };
    case 'UPDATE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.filter(c => c.id !== action.payload)
      };
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, {...action.payload, id: Date.now()}]
      };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload)
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, {...action.payload, id: Date.now()}]
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case 'ADD_TIME_ENTRY':
      return {
        ...state,
        timeEntries: [...state.timeEntries, {...action.payload, id: Date.now()}]
      };
    case 'UPDATE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TIME_ENTRY':
      return {
        ...state,
        timeEntries: state.timeEntries.filter(t => t.id !== action.payload)
      };
    case 'UPDATE_WORKING_DAY':
      return {
        ...state,
        workingDays: {
          ...state.workingDays,
          [action.payload.date]: action.payload.isWorking
        }
      };
    case 'UPDATE_EMAIL_TEMPLATE':
      return {
        ...state,
        emailTemplate: action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: {
      addCollaborator: (collaborator) => dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator }),
      updateCollaborator: (collaborator) => dispatch({ type: 'UPDATE_COLLABORATOR', payload: collaborator }),
      deleteCollaborator: (id) => dispatch({ type: 'DELETE_COLLABORATOR', payload: id }),
      
      addClient: (client) => dispatch({ type: 'ADD_CLIENT', payload: client }),
      updateClient: (client) => dispatch({ type: 'UPDATE_CLIENT', payload: client }),
      deleteClient: (id) => dispatch({ type: 'DELETE_CLIENT', payload: id }),
      
      addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
      updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
      deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
      
      addTimeEntry: (entry) => dispatch({ type: 'ADD_TIME_ENTRY', payload: entry }),
      updateTimeEntry: (entry) => dispatch({ type: 'UPDATE_TIME_ENTRY', payload: entry }),
      deleteTimeEntry: (id) => dispatch({ type: 'DELETE_TIME_ENTRY', payload: id }),
      
      updateWorkingDay: (date, isWorking) => dispatch({ type: 'UPDATE_WORKING_DAY', payload: { date, isWorking } }),
      updateEmailTemplate: (template) => dispatch({ type: 'UPDATE_EMAIL_TEMPLATE', payload: template })
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};