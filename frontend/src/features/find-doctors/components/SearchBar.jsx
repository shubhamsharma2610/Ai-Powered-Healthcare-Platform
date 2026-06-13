import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// Debounced search input to avoid flooding API on every keystroke
export default function SearchBar({ searchTerm, setSearchTerm }) {
  const [localTerm, setLocalTerm] = useState(searchTerm || '');

  useEffect(() => {
    setLocalTerm(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localTerm !== searchTerm) setSearchTerm(localTerm);
    }, 350);

    return () => clearTimeout(handler);
  }, [localTerm, searchTerm, setSearchTerm]);

  return (
    <div className="relative max-w-md mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search by name, specialization, or location..."
        value={localTerm}
        onChange={(e) => setLocalTerm(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary bg-white transition-all"
      />
    </div>
  );
}
