import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './item.css';
import { FaChevronDown, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import ItemForm from './ItemForm';
import ItemDrop from './ItemDrop';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../../assets/r-back.svg";

const Item = () => {
  const [searchView, setSearchView] = useState(false);
  const [formView, setFormView] = useState(false);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [items, setItems] = useState('Active items');
  const [itemData, setItemData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nameChecked, setNameChecked] = useState(false);
  const [itemCheck, setItemCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;
        if (!parsedOrgData || !parsedOrgData.id) {
          console.error('No valid organization selected!');
          return;
        }
        const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/products`));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItemData(data);
      } catch (error) {
        console.error('Error fetching items: ', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = () => {
    setNameChecked(!nameChecked);
    setItemCheck(!nameChecked);
  };

  const addItem = (newItem) => {
    setItemData(prevData => [...prevData, newItem]);
    toast.success('Item added successfully!');
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormView(true);
  };

  const handleDelete = async (id) => {
    const orgData = JSON.parse(localStorage.getItem('selectedOrganization'));
    if (!orgData || !orgData.id) {
      toast.error('No valid organization selected!');
      return;
    }
    try {
      await deleteDoc(doc(db, `organizations/${orgData.id}/products`, id));
      setItemData(prevData => prevData.filter(item => item.id !== id));
      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item: ', error);
      toast.error(`Failed to delete: ${error.message}`);
    }
  };

  return (
    <div className='Main-Container ml-4 md:ml-52'>
      <Navbar />
      <div
        className="relative bg-cover bg-center py-10 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Header */}
        <h1 className="text-2xl mb-4">Products</h1>
        {/* Search Bar */}
        <div className="flex justify-end px-4 items-center  w-full">
          <button className='bg-[#408dfb] flex items-center p-2 px-3 gap-1 text-sm rounded text-white' onClick={() => navigate('/dashboard/item')}>
            <FaPlus /> New
          </button>

        </div>


      </div>
      <ToastContainer />
      
      <div className='bg-[#f1f5f9] flex flex-wrap items-center text-sm px-4 py-2 font-medium'>
        <input type='checkbox' checked={nameChecked} onChange={handleChange} style={{ marginRight: 5, marginTop: 3 }} />
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>NAME</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>DESCRIPTION</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>RATE</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>USAGE UNIT</p>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='search' className={`$ {searchView ? 'w-auto  px-4' : 'w-0 px-0'} absolute right-5 transition-all ease-linear duration-500 border-none rounded p-1`} />
        <HiMagnifyingGlass className='absolute right-8' onClick={() => setSearchView(true)} />
      </div>
      {Array.isArray(itemData) && itemData.length > 0 && itemData.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
        <div key={item.id} className='flex flex-wrap items-center text-sm px-4 py-2 font-medium'>
          <input type='checkbox' checked={itemCheck} onChange={(e) => { setItemCheck(e.target.value); }} style={{ marginRight: 5, marginTop: 3 }} />
          <p className='w-1/2 md:w-1/5 text-[#1d4ed8]' style={{ fontSize: 12 }}>{item.name}</p>
          <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>{item.description}</p>
          <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>₹{item.price}</p>
          <p className='w-1/2 md:w-1/5' style={{ fontSize: 10 }}>{item.unit}</p>
        </div>
      ))}
    </div>
  );
};

export default Item;