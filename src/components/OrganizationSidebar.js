import React, { useEffect, useCallback } from 'react';
import { FaCog, FaCheck } from 'react-icons/fa';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigate } from 'react-router-dom';

const OrganizationSidebar = ({
  isOpen,
  setIsOpen,
  organizations = [],
  selectedOrg,
  setSelectedOrg,
}) => {
  // Load selected organization from AsyncStorage on component mount
  useEffect(() => {
    const loadSelectedOrg = async () => {
      try {
        const savedOrg = await AsyncStorage.getItem('selectedOrganization');
        if (savedOrg) {
          setSelectedOrg(JSON.parse(savedOrg));
        }
      } catch (error) {
        console.error('Failed to load organization from AsyncStorage:', error);
      }
    };

    loadSelectedOrg();
  }, [setSelectedOrg]);

  // Memoized function to handle organization selection
  const handleSelectOrganization = useCallback(async (organization) => {
    setSelectedOrg(organization);
    try {
      await AsyncStorage.setItem('selectedOrganization', JSON.stringify(organization));
      window.location.reload();
    } catch (error) {
      console.error('Failed to save organization to AsyncStorage:', error);
    }
  }, [setSelectedOrg]);

  // useEffect(() => {
  //   if (organizations.length > 0) {
  //     setSelectedOrg(organizations[0]);
  //   }
  // }, [organizations]);
  const navigate = useNavigate();
  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-1/4 h-full bg-white shadow-lg z-20 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">My Organizations</h2>

        {organizations.length > 0 ? (
          <ul>
            {organizations.map((organization) => (
              <li
                key={organization.id}
                className={`flex items-center justify-between p-3 mb-2 cursor-pointer rounded-md transition ${
                  selectedOrg?.id === organization.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSelectOrganization(organization)}
              >
                {/* Organization Logo */}
                <div className="flex items-center">
                  <img
                    src={organization.logo}
                    alt={organization.organizationName}
                    className="w-10 h-10 object-cover border p-1 rounded-full mr-3"
                  />
                  <span className="text-sm font-medium">
                    {organization.organizationName}
                  </span>
                </div>

                {/* Blue Tick for Selected Organization */}
                {selectedOrg?.id === organization.id && (
                  <FaCheck className="text-blue-500 text-lg" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No organizations found</p>
        )}

        {/* Manage Organization Button */}
        {selectedOrg && (
          <button
          className="mt-6 flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
          onClick={() => navigate('/orgform')} // Navigates to the /orgform route
        >
          <FaCog className="text-lg" />
          <span className="text-sm font-medium">Add Organization</span>
        </button>
        )}
      </div>

      {/* Close Sidebar Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-2 p-2 text-xl focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

export default OrganizationSidebar;
