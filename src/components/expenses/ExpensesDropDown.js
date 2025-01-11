import React from 'react';
import { FiPlusCircle } from "react-icons/fi";

const ExpensesDropDown = ({ setDropdownVisibility, setItems }) => {
  const handleDropdownClick = (item = null) => {
    setDropdownVisibility(false);
    if (item) setItems(item);
  };

  return (
    <div className='absolute w-52 bg-white transition-all top-10 shadow-lg font-medium text-gray-700 rounded transition-all'>
      <p className='p-2 text-sm ' onClick={() => handleDropdownClick()}>All</p>
      <p className='px-3 py-1 m-0 text-sm active:bg-blue-600 hover:bg-blue-400' onClick={() => handleDropdownClick('Unbilled')}>Unbilled</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Invoiced')}>Invoiced</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Reimbursed')}>Reimbursed</p>
      <p className='px-3 py-1 m-0  text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Billable')}>Billable</p>
      
      <p className='px-3 py-1 m-0  text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Non-Billable')}>Non-Billable</p>
      <p className='px-3 py-1 m-0  text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('With-Receipts')}>With-Receipts</p>
      <p className='px-3 py-1 m-0 text-sm hover:bg-blue-400' onClick={() => handleDropdownClick('Without-Receipts')}>Without-Receipts</p>
      <p className='px-3 py-1 m-0 text-sm border-t border-gray-300 pb-2'>
        <FiPlusCircle className='inline text-blue-600 mr-2' /> New Custom View
      </p>
    </div>
  );
};

export default ExpensesDropDown;