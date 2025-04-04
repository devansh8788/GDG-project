import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FaAngleDown } from "react-icons/fa";

function EditInvoiceTable({ onTableDataChange, onForm1DataChange, billData }) {
  const [rows, setRows] = useState(() => {
    return billData?.items && billData.items.length > 0
      ? billData.items.map((item, index) => ({
          id: index + 1,
          itemDetails: item.itemDetails || item.name || '',
          quantity: item.quantity || 1,
          rate: item.rate || 0,
          amount: (item.rate || 0) * (item.quantity || 1),
        }))
      : [{ id: 1, itemDetails: '', quantity: 1, rate: 0, amount: 0 }];
  });

  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [TempTotal, setTempTotal] = useState(billData?.subTotal || 0);

  const [notes, setNotes] = useState(billData?.notes || "Thanks for your business.");
  const [total, setTotal] = useState(billData?.total || 0);
  const [isSubtotalOpen, setIsSubtotalOpen] = useState(false);
  const [discount, setDiscount] = useState(billData?.discount || 0);
  const [discountPrice, setDiscountPrice] = useState(billData?.DiscPrice || 0);
  const [taxType, setTaxType] = useState(billData?.taxType || '');
  const [taxRate, setTaxRate] = useState(billData?.taxRate || 0);
  const [taxRatePrice, setTaxRatePrice] = useState(billData?.TaxPrice || 0);
  const [subTotal, setSubTotal] = useState(billData?.subTotal || 0);

  const toggleSubtotal = () => setIsSubtotalOpen(!isSubtotalOpen);

  useEffect(() => {
    onForm1DataChange({
      notes,
      discount,
      taxRate,
      total: subTotal,
      subTotal: TempTotal,
      TaxPrice: taxRatePrice,
      DiscPrice: discountPrice
    });
  }, [notes, subTotal, discount, taxRate, taxRatePrice, TempTotal, discountPrice, onForm1DataChange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgData = await AsyncStorage.getItem('selectedOrganization');
        const parsedOrgData = orgData ? JSON.parse(orgData) : null;

        if (!parsedOrgData || !parsedOrgData.id) {
          console.error("No valid organization selected!");
          return;
        }

        const querySnapshot = await getDocs(collection(db, `organizations/${parsedOrgData.id}/products`));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const subAmount = rows.reduce((acc, row) => acc + (row.amount || 0), 0);
    setTempTotal(parseFloat(subAmount.toFixed(2)));
    setSubTotal(parseFloat(subAmount.toFixed(2)));
  }, [rows]);

  useEffect(() => {
    const DiscPrice = ((TempTotal * discount) / 100).toFixed(2);
    setDiscountPrice(parseFloat(DiscPrice));
    const TaxPrice = (((subTotal - (subTotal * discount) / 100) * taxRate) / 100).toFixed(2);
    setTaxRatePrice(parseFloat(TaxPrice));
    setTotal(parseFloat((subTotal - parseFloat(DiscPrice) + parseFloat(TaxPrice)).toFixed(2)));
  }, [discount, taxRate, TempTotal, subTotal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setShowDropdown(null);
    }
  }, [products]);

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, itemDetails: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: field === 'quantity' || field === 'rate' ? parseFloat(value) || 0 : value,
              amount: field === 'quantity' || field === 'rate'
                ? field === 'quantity'
                  ? parseFloat(value || 0) * row.rate
                  : row.quantity * parseFloat(value || 0)
                : row.amount,
            }
          : row
      )
    );
  };

  const selectProduct = (rowId, product) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? { ...row, itemDetails: product.name, description: product.description, rate: product.price, amount: product.price * row.quantity }
          : row
      )
    );
    setShowDropdown(null);
  };

  useEffect(() => {
    onTableDataChange(rows);
  }, [rows, onTableDataChange]);

  return (
    <div className="p-4 rounded-lg w-full mx-auto">
      <div className="border-b pb-2">
        <h2 className="text-lg font-semibold ml-3">Item Table</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full mt-2 text-sm text-left text-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 pl-3">Item Details</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-center">Rate</th>
              <th className="p-2 text-center">Amount</th>
              <th className="p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-2 relative text-gray-500">
                  <input
                    type="text"
                    value={row.itemDetails}
                    onChange={(e) => handleInputChange(row.id, 'itemDetails', e.target.value)}
                    onClick={() => setShowDropdown(row.id)}
                    placeholder="Type or click to select an item."
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                  {showDropdown === row.id && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto z-10"
                    >
                      {products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => selectProduct(row.id, product)}
                          className="p-2 hover:bg-blue-200 cursor-pointer"
                        >
                          {product.name} - ${product.price}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(row.id, 'quantity', e.target.value)}
                    className="w-16 text-center p-2 border rounded focus:outline-none"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(e) => handleInputChange(row.id, 'rate', e.target.value)}
                    className="w-20 text-center p-2 border rounded focus:outline-none"
                  />
                </td>
                <td className="p-2 text-center font-semibold text-gray-900">
                  {row.amount.toFixed(2)}
                </td>
                <td className="p-2 text-center text-red-500 cursor-pointer" onClick={() => removeRow(row.id)}>
                  X
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mt-4 ml-3">
        <button
          onClick={addRow}
          className="flex items-center justify-center gap-2 px-3 py-2 text-blue-600 border border-blue-600 rounded w-full md:w-auto"
        >
          + Add New Row
        </button>
      </div>

      <div className="p-4 w-full mx-auto pl-3">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Notes
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Thanks for your business."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Will be displayed on the invoice</p>
          </div>

          <div className="md:w-1/2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Sub Total</span>
              <span className="text-sm font-semibold">${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Discount</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <span className="text-sm font-semibold">${discountPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Tax</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <span className="text-sm font-semibold">${taxRatePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditInvoiceTable;
