import React, { useState, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaPlus, FaBell, FaCog, FaFileInvoice, FaBox, FaUserPlus, FaBuilding } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'react-router-dom'; // Import Link for routing
import UserSidebar from './UserSidebar'; // Import the UserSidebar component
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ selectedOrg, setIsSidebarOpen }) => {
    const navigate = useNavigate();
  const [user, setUser] = useState(null); // To store user data
  const [customers, setCustomers] = useState([]); // Store customer data
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Store filtered results
  const [isSidebarOpen, setSidebarOpen] = useState(false); // To manage sidebar state
  const [isDropdownOpen, setDropdownOpen] = useState(false); // To manage dropdown visibility

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (userData) => {
      setUser(userData ? userData : null);
    });
  }, []);

  // Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const db = getFirestore();
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;
    
        if (!parsedOrgData || !parsedOrgData.id) {
          alert('No valid organization selected!');
          return;
        }
    
        const q = query(collection(db, `organizations/${parsedOrgData.id}/customers`));
        const querySnapshot = await getDocs(q);
    
        const customersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        console.log('Fetched Customers:', customersList); // Debugging
        setCustomers(customersList);
        setFilteredCustomers(customersList);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Handle search logic
  useEffect(() => {
    const results = customers
      .filter((customer) => customer.displayName) // Ensure displayName exists
      .filter((customer) =>
        customer.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
    setFilteredCustomers(results);
  }, [searchQuery, customers]);
  

  return (
    <div>
      <nav className="flex justify-between items-center h-14 bg-[#f7f7fe] text-base w-full sticky top-0 p-6">
        {/* Left: Search Bar */}
        <div className="relative w-1/4 md:w-1/3 lg:w-1/4">
          <div className="flex items-center w-full p-2 transition rounded-lg border-gray-300 hover:scale-105 focus-within:scale-105 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:shadow-lg bg-[#ededf7]">
            <FaSearch className="text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search in Customers ( / )"
              className="bg-[#ededf7] outline-none px-3 w-full text-gray-700 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search Results Dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 ">
           {filteredCustomers.length > 0 ? (
  filteredCustomers.map((customer) => (
    <div key={customer.id} className='flex items-center text-sm px-4 py-2 font-medium' onClick={() => navigate(`/dashboard/customerview/${customer.id}`)}>
      {customer.displayName}
    </div>
  ))
) : (
  <div className="p-2 text-gray-500">No customers found</div>
)}

            </div>
          )}
        </div>

        {/* Right: Organization Name, Plus Button, Notifications, Settings, and User Avatar */}
        <div className="flex items-center space-x-4">
          {selectedOrg && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center space-x-2 text-black text-sm"
            >
              <span className="text-gray-600">{selectedOrg.organizationName}</span>
              <FaChevronDown className="text-sm" />
            </button>
          )}

          {/* Add Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="p-2 bg-blue-500 text-white flex items-center justify-center rounded hover:bg-blue-600"
            >
              <FaPlus className="text-xs" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-10 p-3 grid grid-cols-2 gap-2">
                <div>
                  <Link to="/dashboard/invoiceform" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <FaFileInvoice className="mr-2 text-blue-500" /> Add Invoice
                  </Link>
                  <Link to="/dashboard/product" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <FaBox className="mr-2 text-green-500" /> Add Product
                  </Link>
                </div>

                <div>
                  <Link to="/dashboard/customerform" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <FaUserPlus className="mr-2 text-yellow-500" /> Add Customer
                  </Link>
                  <Link to="/dashboard/organization" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    <FaBuilding className="mr-2 text-red-500" /> Add Organization
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Notifications and Settings */}
          <button className="p-2 text-gray-600 hover:text-black">
            <FaBell className="text-sm" />
          </button>
          <button className="p-2 text-gray-600 hover:text-black">
            <FaCog className="text-sm" />
          </button>

          {/* User Avatar */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {user ? (
              <img
                src={'https://via.placeholder.com/150'}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXLb3TY72rHh4VSJUR8UGa83p3ABg3FRBNrw&s"
                alt="Placeholder Avatar"
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>
      </nav>

      {/* UserSidebar Component */}
      <UserSidebar
        user={user}
        selectedOrg={selectedOrg}
        isSidebarOpen={isSidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default Navbar;
