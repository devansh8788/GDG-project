import React from "react";
import { FaFolder, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import backgroundImage from "../../assets/r-back.svg";

const sections = [
  {
    title: "Sales",
    links: ["Sales by Customer", "Sales by Item"],
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
    <div className="flex flex-col min-h-screen bg-gray-50 lg:ml-52">
      <Navbar />
      <main className="flex-grow">
        {/* Background Section */}
        <div
          className="relative bg-cover bg-center py-10 flex flex-col justify-center items-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        >
          {/* Header */}
          <h1 className="text-2xl mb-4">Reports Center</h1>
          {/* Search Bar */}
          <div className="w-full max-w-md px-4">
            <input
              type="text"
              placeholder="Search reports"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 max-w-4xl mx-auto">
            {sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                {/* Section Header */}
                <div className="flex items-center mb-4">
                  <FaFolder className="text-gray-800 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700">{section.title}</h2>
                </div>

                {/* Links */}
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="flex justify-between items-center border-b border-dotted border-gray-300 pb-2 last:border-none"
                    >
                      <Link
                        to={`${link.replace(/\s+/g, "-").toLowerCase()}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {link}
                      </Link>
                      <FaRegStar className="text-gray-400 hover:text-yellow-500 cursor-pointer" />
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                {index < sections.length - 1 && <hr className="border-t border-gray-300 my-6" />}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
