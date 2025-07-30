import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import FilterBar from '../components/Filters/FilterBar';

const { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar, FiUser } = FiIcons;

function Calendar() {
  const { state, actions } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filters, setFilters] = useState({
    collaboratorId: '',
    projectId: '',
    showOnlyWithEntries: false
  });
  const [filteredEntries, setFilteredEntries] = useState(state.timeEntries);

  useEffect(() => {
    let entries = [...state.timeEntries];

    // Apply collaborator filter
    if (filters.collaboratorId) {
      entries = entries.filter(entry => entry.collaboratorId === parseInt(filters.collaboratorId));
    }

    // Apply project filter
    if (filters.projectId) {
      entries = entries.filter(entry => entry.projectId === parseInt(filters.projectId));
    }

    setFilteredEntries(entries);
  }, [state.timeEntries, filters]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Jours fériés français par défaut
  const defaultHolidays = {
    '2024-01-01': 'Jour de l\'An',
    '2024-05-01': 'Fête du Travail',
    '2024-05-08': 'Fête de la Victoire',
    '2024-07-14': 'Fête Nationale',
    '2024-08-15': 'Assomption',
    '2024-11-01': 'Toussaint',
    '2024-11-11': 'Armistice',
    '2024-12-25': 'Noël'
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isWorkingDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = getDay(date);

    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    // Jour férié personnalisé
    if (state.workingDays[dateStr] === false) return false;

    // Jour férié par défaut
    if (defaultHolidays[dateStr]) return false;

    return true;
  };

  const toggleWorkingDay = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const currentStatus = state.workingDays[dateStr];
    actions.updateWorkingDay(dateStr, currentStatus === false ? true : false);
  };

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfWeek = getDay(date);

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { type: 'weekend', label: 'Weekend' };
    }

    if (defaultHolidays[dateStr]) {
      return { type: 'holiday', label: defaultHolidays[dateStr] };
    }

    if (state.workingDays[dateStr] === false) {
      return { type: 'custom-holiday', label: 'Jour non ouvré' };
    }

    return { type: 'working', label: 'Jour ouvré' };
  };

  const getTimeEntries = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredEntries.filter(entry => entry.date === dateStr);
  };

  // Filter options for the filter bar
  const filterOptions = {
    collaboratorOptions: state.collaborators,
    projectOptions: state.projects
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendrier des Jours Ouvrés</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <SafeIcon icon={FiChevronLeft} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <SafeIcon icon={FiChevronRight} />
          </button>
        </div>
      </div>

      {/* FilterBar Component */}
      <FilterBar filters={filters} setFilters={setFilters} options={filterOptions} />

      {/* Légende */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
            <span>Jour ouvré</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
            <span>Jour férié</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
            <span>Weekend</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
            <span>Jour non ouvré personnalisé</span>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7">
          {/* Jours vides au début du mois */}
          {Array.from({ length: (getDay(monthStart) + 6) % 7 }).map((_, index) => (
            <div key={`empty-${index}`} className="h-24 border-b border-r border-gray-200"></div>
          ))}

          {/* Jours du mois */}
          {days.map((day) => {
            const dayStatus = getDayStatus(day);
            const timeEntries = getTimeEntries(day);
            const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

            let bgColor = 'bg-white';
            if (dayStatus.type === 'weekend') bgColor = 'bg-gray-100';
            else if (dayStatus.type === 'holiday') bgColor = 'bg-red-100';
            else if (dayStatus.type === 'custom-holiday') bgColor = 'bg-yellow-100';
            else if (dayStatus.type === 'working') bgColor = 'bg-green-50';

            // Skip days without entries if filter is active
            if (filters.showOnlyWithEntries && timeEntries.length === 0) {
              bgColor += ' opacity-30';
            }

            return (
              <div
                key={day.toISOString()}
                className={`h-24 border-b border-r border-gray-200 ${bgColor} cursor-pointer hover:bg-opacity-80 transition-colors`}
                onClick={() => toggleWorkingDay(day)}
              >
                <div className="p-2 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium ${
                        isToday(day)
                          ? 'bg-primary-600 text-white px-2 py-1 rounded-full'
                          : 'text-gray-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                    {totalHours > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                        {totalHours}h
                      </span>
                    )}
                  </div>

                  {dayStatus.type === 'holiday' && (
                    <div className="text-xs text-red-700 truncate">
                      {dayStatus.label}
                    </div>
                  )}

                  {timeEntries.length > 0 && (
                    <div className="flex-1 overflow-hidden">
                      {timeEntries.slice(0, 2).map((entry, index) => {
                        const collaborator = state.collaborators.find(c => c.id === entry.collaboratorId);
                        const project = state.projects.find(p => p.id === entry.projectId);
                        return (
                          <div key={index} className="text-xs text-gray-600 truncate">
                            {collaborator?.name} - {entry.hours}h
                          </div>
                        );
                      })}
                      {timeEntries.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{timeEntries.length - 2} autres
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {days.filter(day => isWorkingDay(day)).length}
            </div>
            <div className="text-sm text-gray-600">Jours ouvrés</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {days.filter(day => !isWorkingDay(day)).length}
            </div>
            <div className="text-sm text-gray-600">Jours non ouvrés</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {days.reduce((sum, day) => sum + getTimeEntries(day).reduce((s, e) => s + e.hours, 0), 0)}h
            </div>
            <div className="text-sm text-gray-600">Heures pointées</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {days.filter(day => getTimeEntries(day).length > 0).length}
            </div>
            <div className="text-sm text-gray-600">Jours avec pointage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;