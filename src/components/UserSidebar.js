import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
// UserSidebar Component with refined size, layout, and animations
const UserSidebar = ({ user, selectedOrg, isSidebarOpen, closeSidebar }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('selectedOrganization');
      console.log("User logged out successfully");
      // Optionally redirect the user or update the UI
      window.location.href = "/login"; // Example redirect to the login page
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  
  if (!isSidebarOpen) return null;

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-20 
        transition-transform transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } border-l border-gray-300`}
    >
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Info</h2>
        <button
          className="text-red-500 text-2xl font-bold hover:scale-110 transition-transform"
          onClick={closeSidebar}
        >
          ×
        </button>
      </div>

      {/* User Details */}
      {user ? (
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || 'https://via.placeholder.com/150'}
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover shadow-lg"
            />
            <div className="flex flex-col">
              <h3 className="font-medium text-lg text-gray-800">
                {user.displayName || 'No Name'}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* User and Organization IDs */}
          <div className="text-sm text-gray-500">
            <p>User ID: {user.userId || 'No ID available'}</p>
            <p>Organization ID: {selectedOrg?.orgId || 'N/A'}</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {quickActions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center space-y-2 cursor-pointer hover:scale-105 transition-transform"
              >
                <div
                  className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md shadow
                    hover:bg-blue-200 transition-colors duration-200"
                >
                  {action.icon}
                </div>
                <span className="text-sm text-center text-gray-700">
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 mt-6">
          No user information available
        </p>
      )}

      {/* Logout Button */}
      <div className="mt-6">
        <button
          className="flex items-center text-gray-800 hover:text-red-500 transition-colors duration-200"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-2"></i> {/* Logout icon */}
          Logout
        </button>
      </div>
    </div>
  );
};

// Example of quick actions with hover effects
const quickActions = [
  { label: 'Help Documents', icon: <i className="fas fa-file-alt text-gray-600 hover:text-blue-600"></i> },
  { label: 'FAQs', icon: <i className="fas fa-question-circle text-gray-600 hover:text-blue-600"></i> },
  { label: 'Forum', icon: <i className="fas fa-comments text-gray-600 hover:text-blue-600"></i> },
  { label: 'Video Tutorials', icon: <i className="fas fa-video text-gray-600 hover:text-blue-600"></i> },
  { label: 'Explore Features', icon: <i className="fas fa-compass text-gray-600 hover:text-blue-600"></i> },
  { label: 'Migration Guide', icon: <i className="fas fa-sync text-gray-600 hover:text-blue-600"></i> },
];

export default UserSidebar;
