import React from "react";
import { FaFolder } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import Navbar from "../Navbar";
import backgroundImage from "../../assets/r-back.svg";

const sections = [
  {
    title: "Sales",
    links: ["Sales by Customer", "Sales by Sales Person", "Sales by Item"],
  },
  {
    title: "Receivables",
    links: [
      "Customer Balances",
      "AR Aging Details",
      "Quote Details",
      "Bank Charges",
      "Receivable Summary",
    ],
  },
  {
    title: "Payments Received",
    links: ["Payments Received", "Time to Get Paid"],
  },
];

const App = () => {
  return (
    <div className="ml-52">
      <Navbar />
      <div className="bg-gray-50 min-h-screen ">
        {/* Background Section */}
        <div
          className="relative bg-cover bg-center h-40 flex flex-col justify-center items-center"
          style={{
            backgroundImage: `url(${backgroundImage})`, // Local image
          }}
        >
          {/* Header */}
          <h1 className=" text-2xl font-bold">Reports Center</h1>
          {/* Search Bar */}
          <div className="mt-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Search reports"
              className="w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="mt-4 mb-10 mx-auto bg-white w-[60%] rounded-xl shadow-md p-6 border border-black-200">
  {/* Sections */}
  {sections.map((section, index) => (
    <div key={index} className="mb-6 last:mb-0">
      {/* Section Header */}
      <div className="flex items-center mb-4">
        <FaFolder className="text-blue-500 text-xl mr-2" />
        <h2 className="text-lg font-semibold text-gray-700">{section.title}</h2>
      </div>

      {/* Links */}
      <ul className="space-y-2">
        {section.links.map((link, linkIndex) => (
          <li
            key={linkIndex}
            className="flex justify-between items-center border-b border-dotted border-gray-300 pb-2 last:border-none"
          >
            <a href="#" className="text-blue-500 hover:underline text-sm">
              {link}
            </a>
            <FaRegStar className="text-gray-400 hover:text-yellow-500 cursor-pointer" />
          </li>
        ))}
      </ul>

      {/* Divider */}
      {index < sections.length - 1 && <hr className="border-t border-gray-300 mt-6" />}
    </div>
  ))}
</div>


      </div>
    </div>
  );
};

export default App;
