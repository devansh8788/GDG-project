import React, { useState } from 'react';
import { CiCircleQuestion } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { db } from '../../firebase'; // Firebase setup
import { collection, addDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigate } from 'react-router-dom';

const ItemForm = ({ setFormView, addItem }) => {
  const navigate=useNavigate();
  const [selectedValue, setSelectedValue] = useState("option1");
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [unit, setUnit] = useState('');

  const options = ["box", "cm", "M", "Km", "g", "Kg", "mg", "Ft", "ml", "L", "pcs"];

  const handleRadioChange = (value) => setSelectedValue(value);

  const onOptionChangeHandler = (event) => setUnit(event.target.value);

  const handleSave = async () => {
    try {
        // Retrieve the organization data from AsyncStorage
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;

        if (!parsedOrgData || !parsedOrgData.id) {
            alert("No valid organization selected!");
            return;
        }

        const itemData = {
            type: selectedValue,
            unit,
            name,
            price,
            description,
            createdAt: new Date(),
        };

        // Save product to Firestore under the correct organization
        await addDoc(
            collection(db, `organizations/${parsedOrgData.id}/products`),
            itemData
        );

        // Call the function to add the item to the state in Item.js
        addItem(itemData);
        setFormView(false);
    } catch (error) {
        console.error("Error adding item: ", error);
    }
    navigate("/dashboard/product")

};

  return (
    <div className=' h-screen  p-3 relative ml-52'>
      <h4 className='font-normal text-xl'>New Item</h4>

      <div className='flex mt-5 h-10'>
        <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
          <p>Type</p>
          <CiCircleQuestion className='font-medium' />
        </div>

        <div className='flex gap-4 h-0'>
          <div>
            <input
              type="radio"
              id="Goods"
              value="Goods"
              checked={selectedValue === "Goods"}
              onChange={() => handleRadioChange("Goods")}
            />
            <label htmlFor="Goods" className='ml-2'>Goods</label>
          </div>

          <div>
            <input
              type="radio"
              id="Service"
              value="Service"
              checked={selectedValue === "Service"}
              onChange={() => handleRadioChange("Service")}
            />
            <label htmlFor="Service" className='ml-2'>Service</label>
          </div>
        </div>
      </div>

      <div className='flex'>
        <p className='text-[#b91c1c] w-32'>Name*</p>
        <input
          placeholder=''
          className='w-80 rounded border border-gray-300 py-1 focus:border-blue-400 px-3'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='flex my-2'>
        <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
          <p>Unit</p>
          <CiCircleQuestion className='font-medium ' />
        </div>
        <div className='rounded'>
          <select onChange={onOptionChangeHandler} className='rounded border border-gray-400 px-1'>
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className='flex my-2'>
        <p className='w-32'>Price*</p>
        <input
          type="number"
          className='w-80 rounded border border-gray-300 py-1 focus:border-blue-400 px-3'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className='flex my-2'>
        <p className='w-32'>Description*</p>
        <textarea
                                placeholder=''
                                className='w-80 rounded border border-gray-300 py-1 focus:border-blue-400 p-3'
                                value={description}
                                name='shippingStreet1'
                                onChange={(e) => setDescription(e.target.value)}
                            />
        {/* <input
          type="text"
          className='w-80 rounded border border-gray-300 py-1 focus:border-blue-400'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /> */}
      </div>

      <div className='flex gap-4 my-8'>
      <button
        className=' bg-[#408dfb] text-white text-sm p-2 rounded bottom-4'
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className=' bg-[#408dfb] text-black bg-gray-300 text-sm p-2 rounded bottom-4 '
        onClick={() => setFormView(false)}
      >
        Cancel
      </button>
      </div>
    </div>
  );
};

export default ItemForm;
