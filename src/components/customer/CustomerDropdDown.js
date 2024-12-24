import React from 'react';
import { FiPlusCircle } from "react-icons/fi";

const CustomerDropDown = ({ setDropdownVisibility, setItems }) => {
  const handleDropdownClick = (item = null) => {
    setDropdownVisibility(false);
    if (item) setItems(item);
  };

  return (
    <div className='absolute w-52 bg-white transition-all top-10 shadow-lg font-medium text-gray-700 rounded transition-all'>
      <p className='p-2 text-sm ' onClick={() => handleDropdownClick()}>All Customers</p>
      <p className='px-3 py-1 m-0 text-sm active:bg-blue-600 hover:bg-blue-400' onClick={() => handleDropdownClick('Active Customers')}>Active Customers</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('CRM Customers')}>CRM Customers</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Duplicate Customers')}>Duplicate Customers</p>
      <p className='px-3 py-1 m-0  text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Inactive Customers')}>Inactive Customers</p>
      
      <p className='px-3 py-1 m-0  text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Overdue Customers')}>Overdue Customers</p>
      
      <p className='px-3 py-1 m-0 mb-3 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Unpaid Customers')}>Unpaid Customers</p>
      <p className='px-3 py-1 m-0 text-sm border-t border-gray-300 pb-2'>
        <FiPlusCircle className='inline text-blue-600 mr-2' /> New Custom View
      </p>
    </div>
  );
};

export default CustomerDropDown;