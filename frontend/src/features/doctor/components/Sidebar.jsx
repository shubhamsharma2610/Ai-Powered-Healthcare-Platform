// import React from "react";

// export default function Sidebar({ active, setActive, mobileOpen, onClose }) {
//   const menuItems = [
//     { id: "overview", name: "Overview", icon: "📊" },
//     { id: "appointments", name: "Appointments", icon: "📅" },
//     { id: "patients", name: "Patients", icon: "👥" },
//     { id: "schedule", name: "Schedule", icon: "⏰" },
    
//   ];

//   return (
//     <div className="h-full flex flex-col bg-white border-r border-gray-200">
//       <div className="p-6 border-b border-gray-100">
//         <h1 className="text-2xl font-bold text-blue-600">Doctor Portal</h1>
//         <p className="text-xs text-gray-500 mt-1">Quick navigation</p>
//       </div>

//       <nav className="flex-1 p-4 space-y-2">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => {
//               setActive(item.id);
//               if (mobileOpen) onClose();
//             }}
//             className={`w-full text-left px-4 py-3 rounded-xl transition ${
//               active === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
//             }`}
//           >
//             <span className="mr-2">{item.icon}</span>
//             {item.name}
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// }
