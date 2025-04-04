import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'react-toastify';
import Loading from '../Loading';
import Navbar from '../Navbar';

const EditCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customerData, setCustomerData] = useState({
        salutation: '',
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        workPhone: '',
        mobile: '',
        pan: '',
        paymentTerms: '',
        billingStreet1: '',
        billingStreet2: '',
        billingCity: '',
        billingState: '',
        billingPinCode: '',
        billingCountry: '',
        shippingStreet1: '',
        shippingStreet2: '',
        shippingCity: '',
        shippingState: '',
        shippingPinCode: '',
        shippingCountry: ''
    });

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const orgData = await AsyncStorage.getItem('selectedOrganization');
                const parsedOrgData = orgData ? JSON.parse(orgData) : null;

                if (!parsedOrgData?.id) {
                    toast.error('No valid organization selected!');
                    navigate('/dashboard/customer');
                    return;
                }

                const docRef = doc(db, `organizations/${parsedOrgData.id}/customers`, id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCustomerData(docSnap.data());
                } else {
                    toast.error('Customer not found!');
                    navigate('/dashboard/customer');
                }
            } catch (error) {
                toast.error('Error fetching customer data: ' + error.message);
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const orgData = await AsyncStorage.getItem('selectedOrganization');
            const parsedOrgData = orgData ? JSON.parse(orgData) : null;

            if (!parsedOrgData?.id) {
                toast.error('No valid organization selected!');
                return;
            }

            const docRef = doc(db, `organizations/${parsedOrgData.id}/customers`, id);
            await updateDoc(docRef, {
                ...customerData,
                updatedAt: new Date()
            });

            toast.success('Customer updated successfully!');
            navigate(`/dashboard/customerview/${id}`);
        } catch (error) {
            toast.error('Error updating customer: ' + error.message);
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='ml-52'>
            <Navbar />
            <div className='p-4'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-semibold'>Edit Customer</h2>
                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigate(`/dashboard/customerview/${id}`)}
                            className='px-4 py-2 border rounded hover:bg-gray-100'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300'
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    {/* Personal Information */}
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <h3 className='text-lg font-semibold mb-4'>Personal Information</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Salutation</label>
                                <select
                                    name='salutation'
                                    value={customerData.salutation}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                >
                                    <option value="">Select</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Dr.">Dr.</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>First Name</label>
                                <input
                                    type='text'
                                    name='firstName'
                                    value={customerData.firstName}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Last Name</label>
                                <input
                                    type='text'
                                    name='lastName'
                                    value={customerData.lastName}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Display Name</label>
                                <input
                                    type='text'
                                    name='displayName'
                                    value={customerData.displayName}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <h3 className='text-lg font-semibold mb-4'>Contact Information</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={customerData.email}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Work Phone</label>
                                <input
                                    type='tel'
                                    name='workPhone'
                                    value={customerData.workPhone}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Mobile</label>
                                <input
                                    type='tel'
                                    name='mobile'
                                    value={customerData.mobile}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>PAN</label>
                                <input
                                    type='text'
                                    name='pan'
                                    value={customerData.pan}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <h3 className='text-lg font-semibold mb-4'>Billing Address</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Street 1</label>
                                <input
                                    type='text'
                                    name='billingStreet1'
                                    value={customerData.billingStreet1}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Street 2</label>
                                <input
                                    type='text'
                                    name='billingStreet2'
                                    value={customerData.billingStreet2}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>City</label>
                                <input
                                    type='text'
                                    name='billingCity'
                                    value={customerData.billingCity}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>State</label>
                                <input
                                    type='text'
                                    name='billingState'
                                    value={customerData.billingState}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Pin Code</label>
                                <input
                                    type='text'
                                    name='billingPinCode'
                                    value={customerData.billingPinCode}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Country</label>
                                <input
                                    type='text'
                                    name='billingCountry'
                                    value={customerData.billingCountry}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className='bg-white p-6 rounded-lg shadow'>
                        <h3 className='text-lg font-semibold mb-4'>Shipping Address</h3>
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Street 1</label>
                                <input
                                    type='text'
                                    name='shippingStreet1'
                                    value={customerData.shippingStreet1}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Street 2</label>
                                <input
                                    type='text'
                                    name='shippingStreet2'
                                    value={customerData.shippingStreet2}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>City</label>
                                <input
                                    type='text'
                                    name='shippingCity'
                                    value={customerData.shippingCity}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>State</label>
                                <input
                                    type='text'
                                    name='shippingState'
                                    value={customerData.shippingState}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Pin Code</label>
                                <input
                                    type='text'
                                    name='shippingPinCode'
                                    value={customerData.shippingPinCode}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700'>Country</label>
                                <input
                                    type='text'
                                    name='shippingCountry'
                                    value={customerData.shippingCountry}
                                    onChange={handleChange}
                                    className='mt-1 block w-full rounded px-2 py-1 text-sm font-light border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCustomer; 