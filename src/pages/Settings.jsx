import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiMail, FiCalendar, FiSettings: FiSettingsIcon, FiUser } = FiIcons;

function Settings() {
  const { state, actions } = useApp();
  const [emailTemplate, setEmailTemplate] = useState(state.emailTemplate);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'Mon Entreprise',
    currency: 'EUR',
    defaultHourlyRate: 50,
    workingHoursPerDay: 8
  });

  const handleSaveEmailTemplate = () => {
    actions.updateEmailTemplate(emailTemplate);
    alert('Template email sauvegardé avec succès !');
  };

  const handleSaveGeneralSettings = () => {
    // Logique de sauvegarde des paramètres généraux
    alert('Paramètres généraux sauvegardés avec succès !');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <SafeIcon icon={FiSettingsIcon} className="text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Paramètres Généraux</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                value={generalSettings.companyName}
                onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dollar ($)</option>
                <option value="GBP">Livre (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux horaire par défaut (€)
              </label>
              <input
                type="number"
                value={generalSettings.defaultHourlyRate}
                onChange={(e) => setGeneralSettings({...generalSettings, defaultHourlyRate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures de travail par jour
              </label>
              <input
                type="number"
                value={generalSettings.workingHoursPerDay}
                onChange={(e) => setGeneralSettings({...generalSettings, workingHoursPerDay: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSaveGeneralSettings}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiSave} />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Paramètres utilisateur */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <SafeIcon icon={FiUser} className="text-gray-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Profil Utilisateur</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SafeIcon icon={FiUser} className="text-primary-600 text-2xl" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Admin User</h4>
              <p className="text-sm text-gray-500">admin@example.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue="Admin User"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
              <SafeIcon icon={FiSave} />
              <span>Mettre à jour le profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Template email */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiMail} className="text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Template Email de Rappel</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Configurez le template d'email envoyé mensuellement aux collaborateurs pour le pointage.
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objet de l'email
            </label>
            <input
              type="text"
              value={emailTemplate.subject}
              onChange={(e) => setEmailTemplate({...emailTemplate, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corps de l'email
            </label>
            <textarea
              value={emailTemplate.body}
              onChange={(e) => setEmailTemplate({...emailTemplate, body: e.target.value})}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Contenu de l'email..."
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Variables disponibles :</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><code className="bg-gray-200 px-1 rounded">{'{collaborator_name}'}</code> - Nom du collaborateur</p>
              <p><code className="bg-gray-200 px-1 rounded">{'{deadline}'}</code> - Date limite de pointage</p>
              <p><code className="bg-gray-200 px-1 rounded">{'{sender_name}'}</code> - Nom de l'expéditeur</p>
            </div>
          </div>

          <button
            onClick={handleSaveEmailTemplate}
            className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiSave} />
            <span>Sauvegarder le template</span>
          </button>
        </div>
      </div>

      {/* Gestion des jours fériés */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiCalendar} className="text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Jours Fériés</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Les jours fériés français sont automatiquement pris en compte. Vous pouvez gérer les jours non ouvrés personnalisés depuis le calendrier.
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Jours fériés 2024</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Jour de l'An</span>
                  <span>1er janvier</span>
                </div>
                <div className="flex justify-between">
                  <span>Fête du Travail</span>
                  <span>1er mai</span>
                </div>
                <div className="flex justify-between">
                  <span>Fête de la Victoire</span>
                  <span>8 mai</span>
                </div>
                <div className="flex justify-between">
                  <span>Fête Nationale</span>
                  <span>14 juillet</span>
                </div>
                <div className="flex justify-between">
                  <span>Assomption</span>
                  <span>15 août</span>
                </div>
                <div className="flex justify-between">
                  <span>Toussaint</span>
                  <span>1er novembre</span>
                </div>
                <div className="flex justify-between">
                  <span>Armistice</span>
                  <span>11 novembre</span>
                </div>
                <div className="flex justify-between">
                  <span>Noël</span>
                  <span>25 décembre</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Actions</h4>
              <p className="text-sm text-gray-600 mb-3">
                Pour ajouter ou modifier des jours non ouvrés personnalisés, rendez-vous dans la section Calendrier.
              </p>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                Aller au calendrier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;