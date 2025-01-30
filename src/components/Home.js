import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from './Navbar';
import OrganizationSidebar from './OrganizationSidebar';
import OrganizationForm from './OrganizationForm';
import Data from './Data';
import Loading from './Loading'; // Import the Loading component
import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
  const [user] = useAuthState(auth);
  const db = getFirestore();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch organizations from Firestore
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, 'users', user.uid, 'organizations')
        );
        const orgData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrganizations(orgData);
        if (orgData.length > 0) {
          setSelectedOrg(orgData[0]);
          try {
            await AsyncStorage.setItem('selectedOrganization', JSON.stringify(orgData[0]));
          } catch (error) {
            console.error('Failed to save organization to AsyncStorage:', error);
          }
        }
      }
      setLoading(false); // End loading state after fetching
    };
  
    fetchOrganizations();
  }, [user, db]);
  
  // Show loading component if still loading
  if (loading) {
    return <Loading />;
  }

  // Show organization form if no organizations are available
  if (organizations.length === 0) {
    return (
      <OrganizationForm
        user={user}
        onOrganizationAdded={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="flex min-h-screen ml-52">
      {/* Sidebar */}
      <OrganizationSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        organizations={organizations}
        selectedOrg={selectedOrg}
        setSelectedOrg={setSelectedOrg}
      />

      <div className="flex-1">
        {/* Navbar */}
        <Navbar selectedOrg={selectedOrg} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Dashboard Content */}
        <Data setLoading={setLoading} />
      </div>
    </div>
  );
};

export default Home;
