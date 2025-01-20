import React from "react";

export default function Button({ children, onClick, variant = "default", size = "md" }) {
  const styles = `
    px-4 py-2 rounded 
    ${variant === "default" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 border"} 
    ${size === "sm" ? "text-sm" : "text-md"} 
    hover:bg-blue-600 transition-all
  `;
  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
}
