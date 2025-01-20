import React from "react";

export default function Table({ data, columns, footer }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, index) => (
            <th key={index} className="p-2 border border-gray-300 text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((cell, cellIndex) => (
              <td key={cellIndex} className="p-2 border border-gray-300">
                {cell}
              </td>
            ))}
          </tr>
        ))}
        {footer && (
          <tr>
            {footer.map((foot, footIndex) => (
              <td key={footIndex} className="p-2 border border-gray-300 font-semibold">
                {foot}
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  );
}
