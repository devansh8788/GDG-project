import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { db, storage } from '../firebase'; // Firestore and Storage instances
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backGround from '../assets/back.jpg';
import axios from 'axios'
const OrganizationForm = ({ user, onOrganizationAdded }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Form State
  const [logoFile, setLogoFile] = useState(null);
  const [organizationName, setOrganizationName] = useState('');
  const [industry, setIndustry] = useState('');
  const [organizationLocation, setOrganizationLocation] = useState('India');
  const [state, setState] = useState('');
  const [currency] = useState('INR - Indian Rupee');
  const [language] = useState('English');
  const [timezone] = useState('(GMT 5:30) India Standard Time (Asia/Calcutta)');
  const [gstRegistered, setGstRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user) {
      toast.error('Please log in to add organization data.');
      return;
    }
  
    try {
      let logoURL = '';
  
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);
  
        const response = await axios.post('https://invoice-backend-ykyx.onrender.com/upload-logo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        logoURL = response.data.logoURL;
      } else {
        toast.error('Please upload a logo file.');
        return;
      }
  
      // Instead of Firestore, you can save this to your own DB or call another endpoint
      const orgData = {
        logo: logoURL,
        organizationName,
        industry,
        organizationLocation,
        state,
        currency,
        language,
        timezone,
        gstRegistered,
      };
  
      // Call your backend or Firestore endpoint here
      await addDoc(collection(db, 'users', user.uid, 'organizations'), {
        logo: logoURL,
        organizationName,
        industry,
        organizationLocation,
        state,
        currency,
        language,
        timezone,
        gstRegistered,
      })
      console.log('Organization Data:', orgData);
      toast.success('Organization added successfully!');
      onOrganizationAdded();
  
      // Clear form
      setOrganizationName('');
      setState('');
      setLogoFile(null);
    } catch (error) {
      console.error('Error adding organization:', error);
      toast.error('Failed to add organization data.');
    }
  };
  

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${backGround})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '20px',
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
      />

      <div className="bg-white shadow-lg rounded-3xl max-w-3xl w-full border-4 border-white">
        {/* Header Section */}
        <div className="p-6 rounded-t-lg" style={{ backgroundColor: '#f0f4fc' }}>
          <h2 className="text-xl font-bold mb-2">Welcome aboard, {user ? user.displayName : 'User'}! 🤝</h2>
          <p className="text-sm text-gray-600">
            Enter your organization details to get started with Invoiced.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-10 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Organization Name*
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md bg-white focus:border-blue-500 transition"
                placeholder="Enter Organization Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Industry*
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md bg-white"
                placeholder="Enter Industry"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="w-1/2 pr-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Organization Location*
                </label>
                <input
                  type="text"
                  value={organizationLocation}
                  onChange={(e) => setOrganizationLocation(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-md bg-white"
                  placeholder="Enter Location"
                  required
                />
              </div>

              <div className="w-1/2 pl-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  State/Union Territory*
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-md bg-white"
                  placeholder="State/Union Territory"
                  required
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Logo Upload*
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="w-full border border-gray-300 p-3 rounded-md bg-white"
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-600">
                Is this business registered for GST?
              </label>
              <input
                type="checkbox"
                checked={gstRegistered}
                onChange={(e) => setGstRegistered(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="flex items-center justify-between">
              <button type="submit" className="bg-blue-600 text-white py-3 px-5 rounded-md">
                Get Started
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-600 py-3 px-5 rounded-md"
                onClick={() => navigate('/dashboard')} // Navigate to /dashboard
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationForm;
