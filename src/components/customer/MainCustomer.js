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
const CustomerMain = () => {
    const navigate = useNavigate();
    const [searchView, setSearchView] = useState(false);
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const [items, setItems] = useState('Active Customers');
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orgData = await AsyncStorage.getItem('selectedOrganization');
                console.log("Fetched organization data:", orgData); // Debugging line
                const parsedOrgData = orgData ? JSON.parse(orgData) : null;

                if (!parsedOrgData || !parsedOrgData.id) {
                    console.error("No valid organization selected!");
                    return;
                }

                const db = getFirestore(); // Initialize Firestore here
                const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/customers`));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(data);
            } catch (error) {
                console.error("Error fetching items: ", error);
            }
        };

        fetchData();
    }, []);

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
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>RECEIVABLES (BCY)</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>UNUSED CREDITS (BCY)</p>
                <input 
                    placeholder='search' 
                    className={`${searchView ? 'w-1/4 px-4' : 'w-0 px-0'} absolute right-5 transition-all ease-linear duration-500 border border-none rounded font-normal`} 
                />
                <HiMagnifyingGlass className='absolute right-8' onClick={() => setSearchView(true)} />
            </div>
            {customers.map(customer => (
                <div key={customer.id} className='flex items-center text-sm px-4 py-2 font-medium' onClick={() => navigate(`/dashboard/customerview/${customer.id}`)}>
                    <input type='checkbox' style={{ marginRight: 5, marginTop: 3 }} />
                    <p className='flex-1 text-left text-[#1d4ed8]' style={{ fontSize: 12 }}>{customer.displayName}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.companyName || 'Nothing'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.email}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.workPhone}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>₹{customer.receivables || '0.00'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>₹{customer.unusedCredits || '0.00'}</p>
                </div>
            ))}
        </div>
    );
};

export default CustomerMain;
     