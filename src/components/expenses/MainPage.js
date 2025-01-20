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
import CustomerDropDown from './ExpensesDropDown';
const MainPage = () => {
    const navigate = useNavigate();
    const [searchView, setSearchView] = useState(false);
    const [dropdownVisibility, setDropdownVisibility] = useState(false);
    const [items, setItems] = useState('All Expenses');
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
                const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/expenses`));
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
                <div className='flex items-center gap-2 relative cursor-pointer' onClick={() => setDropdownVisibility(!dropdownVisibility)}>
                    <h4>{items}</h4>
                    <FaChevronDown className='text-[#1d4ed8]' />
                    {dropdownVisibility && <CustomerDropDown setDropdownVisibility={setDropdownVisibility} setItems={setItems} />}
                </div>
                <div className='flex gap-2'>
                    <button
                        className="bg-[#408dfb] flex items-center p-2 px-3 gap-1 text-sm rounded text-white"
                        onClick={() => navigate('/dashboard/expensesform')}
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
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>Expense Account</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>Reference#</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>Status</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>DATE</p>
                <p className='flex-1 text-left' style={{ fontSize: 12 }}>Amount</p>
                <input 
                    placeholder='search' 
                    className={`${searchView ? 'w-1/4 px-4' : 'w-0 px-0'} absolute right-5 transition-all ease-linear duration-500 border border-none rounded font-normal`} 
                />
                <HiMagnifyingGlass className='absolute right-8' onClick={() => setSearchView(true)} />
            </div>
            {customers.map(customer => (
                <div key={customer.id} className='flex items-center text-sm px-4 py-2 font-medium' onClick={() => navigate(`/dashboard/expenses/view/${customer.id}`)}>
                    <input type='checkbox' style={{ marginRight: 5, marginTop: 3 }} />
                    <p className='flex-1 text-left text-[#1d4ed8]' style={{ fontSize: 12 }}>{customer.selectedCustomer}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.categoryOptions || 'Nothing'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.expensesNumber}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>{customer.workPhone || 'Non-Billable'}</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>10/10/2024</p>
                    <p className='flex-1 text-left' style={{ fontSize: 12 }}>₹{customer.amount || '0.00'}</p>
                </div>
            ))}
        </div>
    );
};

export default MainPage;
     