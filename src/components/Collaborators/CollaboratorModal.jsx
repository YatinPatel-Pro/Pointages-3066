import React, { useState, useEffect } from 'react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX } = FiIcons;

function CollaboratorModal({ collaborator, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    hourlyRate: '',
    status: 'active',
    contractType: 'CDI',
    startDate: '',
    endDate: '',
    hoursPerDay: 7,
    dailyRate: 0
  });

  useEffect(() => {
    if (collaborator) {
      setFormData(collaborator);
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        hourlyRate: '',
        status: 'active',
        contractType: 'CDI',
        startDate: '',
        endDate: '',
        hoursPerDay: 7,
        dailyRate: 0
      });
    }
  }, [collaborator]);

  // Calculer le taux journalier moyen quand le taux horaire ou le nombre d'heures change
  useEffect(() => {
    if (formData.hourlyRate && formData.hoursPerDay) {
      const dailyRate = parseFloat(formData.hourlyRate) * parseFloat(formData.hoursPerDay);
      setFormData(prev => ({
        ...prev,
        dailyRate: dailyRate
      }));
    }
  }, [formData.hourlyRate, formData.hoursPerDay]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      hourlyRate: parseFloat(formData.hourlyRate),
      hoursPerDay: parseFloat(formData.hoursPerDay),
      dailyRate: parseFloat(formData.dailyRate)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {collaborator ? 'Modifier le collaborateur' : 'Nouveau collaborateur'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poste/Rôle *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Développeur Frontend, Chef de projet..."
            />
          </div>
          
          {/* Nouveaux champs RH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de contrat *
            </label>
            <select
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Alternant">Alternant</option>
              <option value="CDD">CDD</option>
              <option value="CDI">CDI</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin {formData.contractType === 'CDI' ? '(optionnel)' : '*'}
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required={formData.contractType !== 'CDI'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures par jour *
              </label>
              <input
                type="number"
                name="hoursPerDay"
                value={formData.hoursPerDay}
                onChange={handleChange}
                step="0.5"
                min="1"
                max="11"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux horaire (€) *
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taux Journalier Moyen (€)
            </label>
            <input
              type="number"
              name="dailyRate"
              value={formData.dailyRate.toFixed(2)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Calculé automatiquement (Taux horaire × Heures par jour)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {collaborator ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CollaboratorModal;