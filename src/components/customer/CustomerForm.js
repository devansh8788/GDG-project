import React, { useRef, useState } from 'react'
import "./coustmerform.css"
import { CiCircleQuestion } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEmail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { CiMobile1 } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { db, storage } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FiFileText } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from '../Loading';

const Form = ({ setFormView }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("Business");
    const [address, setAddress] = useState(false);
    const [errors, setErrors] = useState({});
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
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

    const validateForm = () => {
        const newErrors = {};
        
        // Required fields validation
        if (!fulldata.displayName) newErrors.displayName = 'Display Name is required';
        if (!fulldata.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(fulldata.email)) newErrors.email = 'Email is invalid';
        
        // Phone number validation
        if (fulldata.workPhone && !/^\d{10}$/.test(fulldata.workPhone)) 
            newErrors.workPhone = 'Work phone must be 10 digits';
        if (fulldata.mobile && !/^\d{10}$/.test(fulldata.mobile)) 
            newErrors.mobile = 'Mobile must be 10 digits';
        
        // PAN validation
        if (fulldata.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(fulldata.pan)) 
            newErrors.pan = 'PAN must be in valid format (e.g., ABCDE1234F)';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRadioChange = (value) => {
        setSelectedValue(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFulldata(prev => ({ ...prev, [name]: value }));
        
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error('File size should be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setLoading(true);
            try {
                const storageRef = ref(storage, `customer-documents/${selectedFile.name}`);
                await uploadBytes(storageRef, selectedFile);
                const url = await getDownloadURL(storageRef);
                setFileUrl(url);
                toast.success('File uploaded successfully');
            } catch (error) {
                toast.error('Error uploading file: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const HandleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);
        try {
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData?.id) {
                toast.error('No valid organization selected!');
                return;
            }

            const customerData = {
                ...fulldata,
                customerType: selectedValue,
                createdAt: new Date(),
                documentUrl: fileUrl,
                status: 'Active'
            };

            await addDoc(
                collection(db, `organizations/${parsedOrgData.id}/customers`),
                customerData
            );

            toast.success('Customer added successfully!');
            navigate("/dashboard/customer");
        } catch (error) {
            toast.error('Error saving customer: ' + error.message);
            console.error("Error adding customer data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const Inputref = useRef();

    const UploadImage = () => {
        Inputref.current.click();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='p-3 relative ml-52 pl-6'>
            <ToastContainer />
            <h4 className='text-2xl text-gray-800 mb-4 border-b-2 border-black-500 pb-1'>
                New Customer
            </h4>
            
            {/* Customer Type Selection */}
            <div className='flex mt-5 h-10 gap-16'>
                <div className='flex gap-1 items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Customer Type</p>
                    <CiCircleQuestion className='font-medium' />
                </div>
                <div className='flex gap-4 h-0'>
                    <div>
                        <input
                            type="radio"
                            id="Business"
                            value="Business"
                            checked={selectedValue === "Business"}
                            onChange={() => handleRadioChange("Business")}
                        />
                        <label htmlFor="Business" className='ml-2'>Business</label>
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

            {/* Primary Contact Information */}
            <div className='flex my-2 gap-16'>
                <div className='flex gap-1 items-center h-0 mt-3 w-32' style={{ fontSize: 13 }}>
                    <p>Primary Contact</p>
                    <CiCircleQuestion className='font-medium' />
                </div>
                <div className='flex'>
                    <div className='rounded border border-gray-300 mt-[-3px] bg-white'>
                        <select
                            onChange={handleChange}
                            name='salutation'
                            className='w-full p-2 pr-8 rounded text-gray-500 font-light text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'
                        >
                            <option value="">Salutation</option>
                            {["Mr.", "Ms.", "Dr.", "Er."].map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <input 
                        placeholder='First Name' 
                        name='firstName' 
                        onChange={handleChange}
                        className='rounded w-32 px-2 py-1 mx-2 mt-[-4px] text-sm font-light border border-gray-300' 
                    />
                    <input 
                        placeholder='Last Name' 
                        name='lastName' 
                        onChange={handleChange}
                        className='rounded w-32 px-2 py-1 text-sm font-light mx-2 mt-[-4px] border border-gray-300' 
                    />
                </div>
            </div>

            {/* Company Name */}
            <div className='flex my-2 mt-4 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Company Name</p>
                <input
                    placeholder=''
                    className='w-96 rounded border border-gray-400 py-1 focus:border-blue-400 px-3'
                    name='companyName'
                    value={fulldata.companyName}
                    onChange={handleChange}
                />
            </div>

            {/* Display Name */}
            <div className='flex my-2 gap-16'>
                <p className='text-[#b91c1c] w-32 text-sm'>Display Name*</p>
                <div className="relative">
                    <input
                        placeholder=''
                        className={`w-96 rounded border ${errors.displayName ? 'border-red-500' : 'border-gray-400'} py-1 focus:border-blue-400 px-3`}
                        value={fulldata.displayName}
                        name='displayName'
                        onChange={handleChange}
                    />
                    {errors.displayName && (
                        <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
                    )}
                </div>
            </div>

            {/* Contact Information */}
            <div className='flex my-2 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Email</p>
                <div className="relative">
                    <input
                        placeholder=''
                        className={`w-96 rounded border ${errors.email ? 'border-red-500' : 'border-gray-400'} py-1 focus:border-blue-400 px-3`}
                        value={fulldata.email}
                        name='email'
                        onChange={handleChange}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>
            </div>

            <div className='flex my-2 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Work Phone</p>
                <div className="relative">
                    <input
                        placeholder=''
                        className={`w-96 rounded border ${errors.workPhone ? 'border-red-500' : 'border-gray-400'} py-1 focus:border-blue-400 px-3`}
                        value={fulldata.workPhone}
                        name='workPhone'
                        onChange={handleChange}
                    />
                    {errors.workPhone && (
                        <p className="text-red-500 text-xs mt-1">{errors.workPhone}</p>
                    )}
                </div>
            </div>

            <div className='flex my-2 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Mobile</p>
                <div className="relative">
                    <input
                        placeholder=''
                        className={`w-96 rounded border ${errors.mobile ? 'border-red-500' : 'border-gray-400'} py-1 focus:border-blue-400 px-3`}
                        value={fulldata.mobile}
                        name='mobile'
                        onChange={handleChange}
                    />
                    {errors.mobile && (
                        <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                    )}
                </div>
            </div>

            {/* Document Upload */}
            <div className='flex my-2 gap-16'>
                <p className='w-32 font-normal text-gray-800 text-sm'>Document</p>
                <div className="relative">
                    <input
                        type="file"
                        ref={Inputref}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                    />
                    <button
                        onClick={UploadImage}
                        className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200"
                    >
                        <FiUpload /> Upload Document
                    </button>
                    {fileUrl && (
                        <p className="text-green-500 text-xs mt-1">Document uploaded successfully</p>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className='flex justify-end mt-8'>
                <button
                    onClick={HandleSave}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default Form;