import React from 'react';
import { FiPlusCircle } from "react-icons/fi";

const ItemDrop = ({ setDropdownVisibility, setItems }) => {
  const handleDropdownClick = (item = null) => {
    setDropdownVisibility(false);
    if (item) setItems(item);
  };

  return (
    <div className='absolute w-52 bg-white transition-all top-10 shadow-lg font-medium text-gray-700 rounded transition-all'>
      <p className='p-2 text-sm' onClick={() => handleDropdownClick()}>All</p>
      <p className='px-3 py-1 m-0 text-sm active:bg-blue-600 hover:bg-blue-400' onClick={() => handleDropdownClick('Active items')}>Active</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Inactive items')}>Inactive</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Sales')}>Sales</p>
      <p className='px-3 py-1 m-0 mb-3 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Services')}>Services</p>
      <p className='px-3 py-1 m-0 text-sm border-t border-gray-300 pb-2'>
        <FiPlusCircle className='inline text-blue-600 mr-2' /> New Custom View
      </p>
    </div>
  );
};

export default ItemDrop;