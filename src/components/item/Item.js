import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import Firestore instance
import './item.css';
import { FaChevronDown, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import ItemForm from './ItemForm';
import ItemDrop from './ItemDrop';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Navbar from"../Navbar";
import { useNavigate } from 'react-router-dom';


const Item = () => {
  const [searchView, setSearchView] = useState(false);
  const [formView, setFormView] = useState(false);
  const [dropdownVisibility, setDropdownVisibility] = useState(false);
  const [items, setItems] = useState('Active items');
  const [itemData, setItemData] = useState([]); // Store fetched data
  const [currentItem, setCurrentItem] = useState(null); // State to hold the item being edited
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [nameChecked,setNameChecked]=useState(false)
  const [itemCheck,setItemCheck]=useState(false);
    const navigate = useNavigate();
  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
        try {
            // Retrieve the organization data from AsyncStorage
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData || !parsedOrgData.id) {
                console.error("No valid organization selected!");
                return;
            }

            // Fetch items from Firestore under the correct organization
            const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/products`));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItemData(data);
        } catch (error) {
            console.error("Error fetching items: ", error);
        }
    };

    fetchData();
}, []);

// useEffect(() => {
//   // Synchronize itemCheck with nameChecked
//   setItemCheck(nameChecked);
// }, [nameChecked]);
const handleChange=()=>{
  setNameChecked(!nameChecked);
  setItemCheck(!nameChecked)
}

  // Callback to add new item to the state
  const addItem = (newItem) => {
    setItemData(prevData => [...prevData, newItem]);
    toast.success("Item added successfully!"); // Toast notification for add
  };

  // Handle edit item
  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormView(true);
  };

  // Handle delete item
  const handleDelete = async (id) => {
    const orgData = JSON.parse(localStorage.getItem('selectedOrganization'));
    
    if (!orgData || !orgData.id) {
      toast.error("No valid organization selected!"); // Toast notification for error
      return;
    }

    try {
      await deleteDoc(doc(db, `organizations/${orgData.id}/products`, id));
      setItemData(prevData => prevData.filter(item => item.id !== id));
      toast.success("Item deleted successfully!"); // Toast notification for delete
    } catch (error) {
      console.error("Error deleting item: ", error);
      toast.error(`Failed to delete: ${error.message}`); // Toast notification for error
    }
  };

  // Handle disable item (toggle)
  const handleToggleDisable = async (item) => {
    const orgData = JSON.parse(localStorage.getItem('selectedOrganization'));
    
    if (!orgData || !orgData.id) {
      toast.error("No valid organization selected!"); // Toast notification for error
      return;
    }

    const updatedItem = { ...item, disabled: !item.disabled }; // Toggle the disabled state

    try {
      await updateDoc(doc(db, `organizations/${orgData.id}/products`, item.id), updatedItem);
      setItemData(prevData => prevData.map(i => (i.id === item.id ? updatedItem : i)));
      toast.success(`Item ${updatedItem.disabled ? 'disabled' : 'enabled'} successfully!`); // Toast notification for toggle
    } catch (error) {
      console.error("Error updating item: ", error);
      toast.error(`Failed to update: ${error.message}`); // Toast notification for error
    }
  };

  return (
    <div className='Main-Container ml-4 md:ml-52'>
      <Navbar/>
      <ToastContainer /> {/* Add the ToastContainer here */}
      <div className='flex flex-col md:flex-row justify-between p-4'>
        <div
          className='flex items-center gap-2 relative mb-4 md:mb-0'
          onClick={() => setDropdownVisibility(!dropdownVisibility)}
        >
          <h4>{items}</h4>
          <FaChevronDown className='text-[#1d4ed8]' />
          {dropdownVisibility && (
            <ItemDrop
              setDropdownVisibility={setDropdownVisibility}
              setItems={setItems}
            />
          )}
        </div>
        <div className='flex gap-2'>
          <button
            className='bg-[#408dfb] flex items-center p-2 px-3 gap-1 text-sm rounded text-white'
            onClick={() => navigate('/dashboard/item')}
          >
            <FaPlus /> New
          </button>
          <button
            className='p-2 border bg-[#e5e7eb] rounded'
            onClick={() => navigate('/dashboard/item')}
          >
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      <div className='bg-[#f1f5f9] flex flex-wrap items-center text-sm px-4 py-2 font-medium'>
        <input type='checkbox' checked={nameChecked} onChange={handleChange} style={{ marginRight: 5, marginTop: 3 }} />
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>NAME</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>DESCRIPTION</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>RATE</p>
        <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>USAGE UNIT</p>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='search'
          className={`${
            searchView ? 'w-full md:w-1/4 px-4' : 'w-0 px-0'
          } absolute right-5 transition-all ease-linear duration-500 border-none rounded`}
        />
        <HiMagnifyingGlass
          className='absolute right-8'
          onClick={() => setSearchView(true)}
        />
      </div>

      {Array.isArray(itemData) && itemData.length > 0 && itemData
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => (
          <div key={item.id} className='flex flex-wrap items-center text-sm px-4 py-2 font-medium'>
            <input type='checkbox' checked={itemCheck} onChange={(e)=>{setItemCheck(e.target.value)}} style={{ marginRight: 5, marginTop: 3 }} />
            <p className='w-1/2 md:w-1/5 text-[#1d4ed8]' style={{ fontSize: 12 }}>
              {item.name}
            </p>
            <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>
              {item.description}
            </p>
            <p className='w-1/2 md:w-1/5' style={{ fontSize: 12 }}>
              ₹{item.price}
            </p>
            <p className='w-1/2 md:w-1/5' style={{ fontSize: 10 }}>
              {item.unit}
            </p>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => navigate("/dashboard/item/update",{ state: { item: item } })}
                className='flex items-center bg-transparent text-[#408dfb] py-1 px-2 rounded hover:bg-[#e0f2fe] transition'
              >
                <FaEdit className='mr-1' />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className='flex items-center bg-transparent text-red-500 py-1 px-2 rounded hover:bg-red-100 transition'
              >
                <FaTrash className='mr-1' />
              </button>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!item.disabled}
                  onChange={() => handleToggleDisable(item)}
                  className="hidden"
                />
                <div
                  className={`flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${item.disabled ? 'bg-yellow-500' : 'bg-green-500'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${item.disabled ? 'translate-x-0' : 'translate-x-6'}`}
                  />
                </div>
              </label>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Item;
