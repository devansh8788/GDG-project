import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiPlusCircle } from 'react-icons/fi';

const EditDropDown = ({ dropDownId, setDropDownShow, setTerms , updateTerms }) => {
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownShow(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setDropDownShow]);

    // Click handlers
    const handleOptionClick = (term) => {
      updateTerms(dropDownId , term)
        setTerms(term);
        setDropDownShow(false);
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute w-52 h-52 border bg-white right-7 top-7 z-[99] p-2 pb-0 drop-shadow-md"
        >
            <p
                className="border-b p-2 cursor-pointer"
                onClick={() => handleOptionClick('Paid')}
            >
                Mark as Paid
            </p>
            <p
                className="border-b p-2 cursor-pointer"
                onClick={() => handleOptionClick('Net 15')}
            >
                Net 15
            </p>
            <p
                className="border-b p-2 cursor-pointer"
                onClick={() => handleOptionClick('Net 30')}
            >
                Net 30
            </p>
            <p
                className="border-b p-2 cursor-pointer"
                onClick={() => handleOptionClick('Net 45')}
            >
                Net 45
            </p>
            <p className="m-0 text-sm border-gray-300 p-2 cursor-pointer">
                <FiPlusCircle className="inline text-blue-600 mr-2" /> New Custom View
            </p>
        </div>
    );
};

EditDropDown.propTypes = {
    dropDownId: PropTypes.string.isRequired,
    setDropDownShow: PropTypes.func.isRequired,
    setTerms: PropTypes.func.isRequired,
};

export default EditDropDown;
