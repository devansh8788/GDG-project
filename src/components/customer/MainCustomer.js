import React, { useState, useEffect } from 'react';
import '../customer/Customer.css';
import { FaChevronDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";
import DropDown from '../item/ItemDrop';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "../Navbar"
import CustomerDropDown from './CustomerDropdDown';
import Loading from '../Loading';

const CustomerMain = () => {
    const navigate = useNavigate();
    const [searchView, setSearchView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const [items, setItems] = useState('Active Customers');
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const orgData = await AsyncStorage.getItem('selectedOrganization');
                const parsedOrgData = orgData ? JSON.parse(orgData) : null;

                if (!parsedOrgData || !parsedOrgData.id) {
                    setError("No valid organization selected!");
                    return;
                }

                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/customers`));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(data);
            } catch (error) {
                setError("Error fetching customers: " + error.message);
                console.error("Error fetching items: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchQuery.toLowerCase();
        return (
            customer.displayName?.toLowerCase().includes(searchLower) ||
            customer.companyName?.toLowerCase().includes(searchLower) ||
            customer.email?.toLowerCase().includes(searchLower) ||
            customer.workPhone?.includes(searchQuery)
        );
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentItems = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 ml-52 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className='Main-Container ml-52'>
            <Navbar/>
            <div className='flex justify-between p-4'>
                <h1 className="text-lg font-bold text-left">Clients</h1>
                <div className='flex gap-2'>
                    <button
                        className="bg-[#408dfb] flex items-center p-2 px-3 gap-1 text-sm rounded text-white"
                        onClick={() => navigate('/dashboard/customerform')}
                    >
                        <FaPlus /> New
                    </button>
                    <button className='p-2 border bg-[#e5e7eb] rounded' onClick={() => setDropdownVisibility(false)}>
                        <BsThreeDotsVertical />
                    </button>
                </div>
            </div>
            <div className='bg-[#f1f5f9] flex items-center text-sm px-4 py-2 font-medium'>
                <input type='checkbox' style={{ marginRight: 5, marginTop: 3 }} />
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>NAME</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>COMPANY NAME</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>EMAIL</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>WORK PHONE</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>RECEIVABLES (INR)</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>UNUSED CREDITS (INR)</p>
                <div className="relative">
                    <input 
                        type="text"
                        placeholder='Search...' 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${searchView ? 'w-64' : 'w-0'} px-4 py-1 transition-all duration-300 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <HiMagnifyingGlass 
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer' 
                        onClick={() => setSearchView(!searchView)} 
                    />
                </div>
            </div>
            {currentItems.map(customer => (
                <div key={customer.id} className='flex items-center text-sm px-4 py-2 font-medium hover:bg-gray-50 cursor-pointer' onClick={() => navigate(`/dashboard/customerview/${customer.id}`)}>
                    <input type='checkbox' style={{ marginRight: 5, marginTop: 3 }} />
                    <p className='flex-1 text-left text-[#1d4ed8]' style={{ fontSize: 12 }}>{customer.displayName}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.companyName || '-'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.email || '-'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.workPhone || '-'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>₹{customer.receivables || '0.00'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>₹{customer.unusedCredits || '0.00'}</p>
                </div>
            ))}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-l-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 border-t border-b">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-r-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerMain;
     