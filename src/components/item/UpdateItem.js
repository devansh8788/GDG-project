import React, { useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { db } from "../../firebase"; // Firebase setup
import { doc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};

  const [selectedValue, setSelectedValue] = useState(item?.selectedValue || "");
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");
  const [description, setDescription] = useState(item?.description || "");
  const [unit, setUnit] = useState(item?.unit || "");

  const options = ["box", "cm", "M", "Km", "g", "Kg", "mg", "Ft", "ml", "L", "pcs"];

  const handleSave = async () => {
    if (!name || !price || !description) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const orgData = await AsyncStorage.getItem("selectedOrganization");
      const parsedOrgData = orgData ? JSON.parse(orgData) : null;

      if (!parsedOrgData?.id) {
        alert("No valid organization selected!");
        return;
      }

      const itemData = {
        type: selectedValue,
        unit,
        name,
        price: parseFloat(price), // Ensure price is saved as a number
        description,
        updatedAt: new Date(),
      };

      // Update product in Firestore
      const docRef = doc(db, `organizations/${parsedOrgData.id}/products/${item.id}`);
      await updateDoc(docRef, itemData);
      console.log('====================================');
      console.log("hello");
      console.log('====================================');
      navigate("/dashboard/product"); // Navigate to product page
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="h-screen p-3 relative ml-52">
      <h4 className="font-normal text-xl">Update Item</h4>

      {/* Type */}
      <div className="flex mt-5 h-10">
        <label className="flex gap-1 font-medium items-center w-32" style={{ fontSize: 13 }}>
          Type <CiCircleQuestion />
        </label>
        <div className="flex gap-4">
          {["Goods", "Service"].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                value={type}
                checked={selectedValue === type}
                onChange={() => setSelectedValue(type)}
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="flex my-2">
        <label className="w-32 text-[#b91c1c]">Name*</label>
        <input
          className="w-80 rounded border border-gray-300 py-1 focus:border-blue-400 px-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Unit */}
      <div className="flex my-2">
        <label className="flex gap-1 font-medium items-center w-32" style={{ fontSize: 13 }}>
          Unit <CiCircleQuestion />
        </label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="rounded border border-gray-400 px-1"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="flex my-2">
        <label className="w-32">Price*</label>
        <input
          type="number"
          className="w-80 rounded border border-gray-300 py-1 focus:border-blue-400 px-3"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex my-2">
        <label className="w-32">Description*</label>
        <textarea
          className="w-80 rounded border border-gray-300 py-1 focus:border-blue-400 p-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 my-8">
        <button
          className="bg-[#408dfb] text-white text-sm p-2 rounded"
          onClick={handleSave}
        >
          Update
        </button>
        <button
          className="bg-gray-300 text-black text-sm p-2 rounded"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateItem;
