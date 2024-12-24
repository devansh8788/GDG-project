

import React, { useRef, useState } from 'react'
import "./coustmerform.css"
import { CiCircleQuestion } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { CiMobile1 } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { db } from '../../firebase'; // Import your Firebase configuration here
import { collection, addDoc } from "firebase/firestore"; // Import collection and addDoc
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
// Import db from your firebaseConfig file


const Form = ({ setFormView }) => {
    const navigate=useNavigate();
    const [selectedValue, setSelectedValue] = useState("option1");
    const [address, setAdress] = useState(false);
    const [fulldata, setFulldata] = useState({
        salutation: '',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName: '',
        currency: 'INR',
        email: '',
        workPhone: '',
        mobile: '',
        pan: '',
        paymentTerms: '',
        billingAttention: '',
        billingCountry: '',
        billingStreet1: '',
        billingStreet2: '',
        billingCity: '',
        billingState: '',
        billingPinCode: '',
        billingPhone: '',
        shippingAttention: '',
        shippingCountry: '',
        shippingStreet1: '',
        shippingStreet2: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingPhone: ''
    });

    const handleRadioChange = (value) => {
        setSelectedValue(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFulldata({ ...fulldata, [name]: value });
        console.log('====================================');
        console.log(fulldata);
        console.log('====================================');
    };

    const options = ["Mr.", "Ms.", "Dr.", "Er."];

    const options2 = [
        "Net 15",
        "Net 30",
        "Net 45",
        "Net 60",
        "Due on receipt",
        "Due end of the month",
        "Due end of the next month",
    ];

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
        "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
        "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
        "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
        "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica",
        "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
        "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
        "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
        "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
        "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
        "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan",
        "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
        "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
        "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
        "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
        "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
        "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
        "Yemen", "Zambia", "Zimbabwe"
    ];

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
        "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
        "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];



    const HandleSave = async () => {
        try {
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            console.log("Retrieved organization data: ", orgData); // Log the raw data

            if (!orgData) {
                alert("No valid organization selected!");
                return;
            }

            const parsedOrgData = JSON.parse(orgData);
            console.log("Parsed organization data: ", parsedOrgData); // Log the parsed data

            if (!parsedOrgData || !parsedOrgData.id) { // Change to 'id'
                alert("No valid organization selected!");
                return;
            }

            // Combine fulldata and selectedValue
            const customerData = {
                ...fulldata,
                selectedValue,
                createdAt: new Date(),
            };

            // Save customer data to Firestore under the correct organization
            await addDoc(
                collection(db, `organizations/${parsedOrgData.id}/customers`), // Change to 'id'
                customerData
            );

            console.log("Customer data saved successfully!");
                  toast.success('Customer Added successful!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  });
            navigate("/dashboard/customer")
            setFulldata({});
            // setFormView(false);
        } catch (error) {
            console.error("Error adding customer data: ", error);
            alert(`Failed to save: ${error.message}`);
        }
    };



    const Inputref = useRef();

    const UploadImage = () => {
        Inputref.current.click();
    };

    return (
        <div className='w-full  p-3 relative ml-52 pl-6'>
                  <ToastContainer />
            <h4 className='text-2xl  text-gray-800 mb-4 border-b-2 border-black-500 pb-1'>
                New Customer
            </h4>
            <div className='flex mt-5 h-10 gap-16'>
                <div className='flex gap-1   items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Customer Type</p>
                    <CiCircleQuestion className='font-medium ' />
                </div>

                <div className='flex gap-4 h-0'>
                    <div>
                        <input
                            type="radio"
                            id="Buisness"
                            value="Buisness"
                            checked={selectedValue === "Buisness"}
                            onChange={() => handleRadioChange("Buisness")}
                        />
                        <label htmlFor="Buisness" className='ml-2'>Buisness</label>
                    </div>

                    <div>
                        <input
                            type="radio"
                            id="Individual"
                            value="Individual"
                            checked={selectedValue === "Individual"}
                            onChange={() => handleRadioChange("Individual")}
                        />
                        <label htmlFor="Individual" className='ml-2'>Individual</label>
                    </div>
                </div>
            </div>

            <div className='flex my-2 gap-16'>
                <div className='flex gap-1 items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Primary Contact</p>
                    <CiCircleQuestion className='font-medium ' />
                </div>
                <div className='flex'>
                <div className='rounded border border-gray-300 mt-[-3px] bg-white'>
                    <select
                        onChange={(e) => handleChange(e)}
                        name='salutation'
                        className='w-full p-2 pr-8 rounded text-gray-500 font-light text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 '
                    >
                        <option >Salutation</option>
                        {options.map((option, index) => (
                            <option key={index} className='text-gray-500'>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <input placeholder='First Name' name='firstName' onChange={(e) => { handleChange(e) }} className='rounded  w-32 px-2 py-1 mx-2 mt-[-4px] text-sm font-light border border-gray-300' />
                <input placeholder='Last Name' name='lastname' onChange={(e) => { handleChange(e) }} className='rounded w-32 px-2 py-1 text-sm font-light mx-2 mt-[-4px]  border border-gray-300' />
            </div>
            </div>

            <div className='flex my-2 mt-4 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Company Name</p>
                <input
                    placeholder=''
                    className='w-96 rounded border border-gray-400 py-1 focus:border-blue-400'
                    name='companyName'
                    value={fulldata.companyName}
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className='flex my-2 gap-16'>
                <p className='text-[#b91c1c] w-32 text-sm'>Display Name*</p>
                <input
                    placeholder=''
                    className='w-96 rounded border border-gray-400 py-1 focus:border-blue-400'
                    value={fulldata.displayName}
                    name='displayName'
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className='flex my-2 gap-16'>
                <div className='flex gap-1 font-nomel items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Currency</p>
                </div>
                <div className='rounded border border-gray-400'>
                    <select className='w-96 p-1 rounded  cursor-not-allowed text-gray-600 font-light'>
                        <option className='text-gray-400'>INR- indian Rupee</option>
                    </select>
                </div>
            </div>

            <div className='flex my-2 gap-16'>
                <div className='flex gap-1 items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Email Address</p>
                    <CiCircleQuestion className='font-medium ' />
                </div>
                <div className='relative'>
                    <MdOutlineEmail className='absolute left-2 top-2  text-[#6b7280]' />
                    <input
                        placeholder=''
                        className='w-96 rounded border border-gray-400 py-1 focus:border-blue-400 pl-8'
                        value={fulldata.email}
                        name='email'
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            </div>

            <div className='flex my-12 mt-3 gap-16'>
                <div className='flex gap-1 items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Phone</p>
                    <CiCircleQuestion className='font-medium ' />
                </div>
                <div className='flex'>
                <div className='relative'>
                    <IoCallOutline className='absolute left-1 top-[5px] text-[14px] text-[#6b7280]' />
                    <input placeholder='Work Phone' value={fulldata.workPhone} name='workPhone' onChange={(e) => handleChange(e)} className='rounded text-black w-44 pl-6 py-1 mt-[-4px] border border-gray-400' />
                </div>
                <div className='relative ml-4'>
                    <CiMobile1 className='absolute left-1 top-1 text-[#6b7280]' />
                    <input placeholder='Mobile' value={fulldata.mobile} name='mobile' onChange={(e) => handleChange(e)} className='rounded w-44 pl-6 py-1 mt-[-4px] border border-gray-400' />
                </div>
            </div>
            </div>
            <div className='flex gap-5 px-4  m-8 border-b border-black'>
                <p
                    className={`${!address ? 'border-b-4 pb-2 border-b-[#1d4ed8]' : ''} m-0 px-1 cursor-pointer`}
                    onClick={() => { setAdress(false) }}
                >
                    Other Details
                </p>
                <p
                    className={`${address ? 'border-b-4 pb-2 border-b-[#1d4ed8]' : ''} m-0 px-1 cursor-pointer`}
                    onClick={() => { setAdress(true) }}
                >
                    Address
                </p>
                <p>Contact Persons</p>
                <p>Remarks</p>
            </div>
            {!address ?
                <>
                    <div className='flex my-3 gap-16'>
                        <div className='flex gap-1 font-light items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                            <p>PAN</p>
                            <CiCircleQuestion className='font-medium ' />
                        </div>
                        <input
                            placeholder=''
                            className='w-96 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                            value={fulldata.pan}
                            name='pan'
                            onChange={(e) => handleChange(e)}
                        />
                    </div>

                    <div className='flex my-2 gap-16'>
                        <div className='flex gap-1 font-light items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                            <p>Payment Terms</p>
                        </div>
                        <div className='rounded  mt-[-3px]'>
                            <select onChange={(e) => { handleChange(e) }} name='paymentTerms' className='w-96 p-1 font-light rounded border border-gray-400'>
                                <option>Due on receipt</option>
                                {options2.map((option, index) => {
                                    return (
                                        <option key={index}>
                                            {option}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className='flex my-2 gap-16'>
                        <div className='flex gap-1 items-center h-0 mt-[26px] w-32' style={{ fontSize: 14 }}>
                            <p className='font-light'>Enable Portal</p>
                            <CiCircleQuestion className='font-medium'/>
                        </div>
                        <div className='flex items-end m-0 p-0'>
                        <input type='checkbox' className='my-0' />
                        <p className=' mx-2 text-sm my-0 mt-3'>Allow portal access for this customer</p>
                        </div>
                    </div>

                    <div className='flex my-2 pb-24'>

                        <div className='flex flex-col my-4 items-start'>

                            <div
                                className='flex justify-center items-center gap-2 py-2 px-4 cursor-pointer rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200 ease-in-out'
                                onClick={UploadImage}
                            >
                                <FiFileText className='text-lg' />
                                <p className='text-sm font-semibold'>Upload Document</p>
                            </div>
                            <input
                                type='file'
                                ref={Inputref}
                                className='hidden'
                                name='UploadImage'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <input
                            type='file'
                            ref={Inputref}
                            className='hidden w-64 rounded border-2 border-blue-300 border-dashed py-1 pl-8 focus:border-blue-400'
                            value={fulldata.UploadImage}
                            name='UploadImage'
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </> :
                <div className='flex gap-12'>
                    <div>
                        <h6 className='mb-4'>Billing Address</h6>
                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Attention</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.billingAttention}
                                name='billingAttention'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                                <p>Country Region</p>
                            </div>
                            <div className='rounded  mt-[-3px]'>
                                <select onChange={(e) => { handleChange(e) }} name='billingCountry' className='w-64 p-1 rounded border border-gray-400'>
                                    <option>Select</option>
                                    {countries.map((option, index) => {
                                        return (
                                            <option key={index}>
                                                {option}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Address</p>
                            </div>
                            <textarea
                                placeholder='Street 1'
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 p-2'
                                value={fulldata.billingStreet1}
                                name='billingStreet1'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p></p>
                            </div>
                            <textarea
                                placeholder='Street 1'
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 p-2'
                                value={fulldata.billingStreet2}
                                name='billingStreet2'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>City</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.billingCity}
                                name='billingCity'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                                <p>State</p>
                            </div>
                            <div className='rounded mt-[-3px]'>
                                <select onChange={(e) => { handleChange(e) }} name='shippingState' className='w-64 p-1 rounded border border-gray-400'>
                                    <option>Select or type to add</option>
                                    {indianStates.map((option, index) => {
                                        return (
                                            <option key={index}>
                                                {option}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Pin code</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.billingPinCode}
                                name='billingPinCode'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2 pb-12'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Phone</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.billingPhone}
                                name='billingPhone'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                    <div>
                        <h6 className='mb-4'>Shipping Address</h6>
                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Attention</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.shippingAttention}
                                name='shippingAttention'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                                <p>Country Region</p>
                            </div>
                            <div className='rounded  mt-[-3px]'>
                                <select onChange={(e) => { handleChange(e) }} name='shippingCountry' className='w-64 p-1 rounded border border-gray-400'>
                                    <option>Select</option>
                                    {countries.map((option, index) => {
                                        return (
                                            <option key={index}>
                                                {option}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Address</p>
                            </div>
                            <textarea
                                placeholder='Street 1'
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 p-2'
                                value={fulldata.shippingStreet1}
                                name='shippingStreet1'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p></p>
                            </div>
                            <textarea
                                placeholder='Street 1'
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 p-2'
                                value={fulldata.shippingStreet2}
                                name='shippingStreet2'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>City</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.shippingCity}
                                name='shippingCity'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 font-medium items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                                <p>State</p>
                            </div>
                            <div className='rounded  mt-[-3px]'>
                                <select onChange={(e) => { handleChange(e) }} name='shippingState' className='w-64 p-1 rounded border border-gray-400'>
                                    <option>Select or type to add</option>
                                    {indianStates.map((option, index) => {
                                        return (
                                            <option key={index}>
                                                {option}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className='flex my-2'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Pin code</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.shippingPinCode}
                                name='shippingPinCode'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className='flex my-2 pb-12'>
                            <div className='flex gap-1 items-center h-0 mt-4 w-32' style={{ fontSize: 14 }}>
                                <p>Phone</p>
                            </div>
                            <input
                                placeholder=''
                                className='w-64 rounded border border-gray-300 py-1 focus:border-blue-400 pl-8'
                                value={fulldata.shippingPhone}
                                name='shippingPhone'
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                </div>
            }
            <div className='h-16 w-full bottom-0 left-0 fixed border border-1 flex items-center shadow-md bg-white ml-52'>
                <div className='flex gap-3 px-8 '>
                    <button className='bg-[#408dfb] flex items-center px-2 py-1 gap-1 text-sm rounded text-white' style={{ fontSize: 13 }} onClick={HandleSave}>Save</button>
                    <button className='px-2 py-1 border bg-[#e5e7eb] rounded font-medium' style={{ fontSize: 13 }} onClick={() => setFormView(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default Form;