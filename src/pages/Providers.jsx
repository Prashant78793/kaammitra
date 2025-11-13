import React, { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import axios from "axios";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProvider, setSelectedProvider] = useState(null);

  // ✅ Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/providers");
        setProviders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    fetchProviders();
  }, []);

  // ✅ Safe filtering with null/undefined checks
  const filteredProviders = providers.filter((p) => {
    const matchesFilter = filter === "All" || p.status === filter;
    const matchesSearch =
      (p.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (p.category?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-red-100 text-red-700";
      case "Suspended":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-4">
        Service Providers
      </h2>

      {/* 🔍 Search Bar */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-2 mb-4 w-full sm:w-1/2 shadow-sm">
        <Search className="text-gray-500 mr-2" size={18} />
        <input
          type="text"
          placeholder="Search by Name, Email, or Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-200"
        />
      </div>

      {/* 🧩 Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Active", "Pending", "Suspended"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              filter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* 📋 Provider Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Jobs</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProviders.length > 0 ? (
              filteredProviders.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-3">{p.name || "N/A"}</td>
                  <td className="p-3">{p.category || "N/A"}</td>
                  <td className="p-3">{p.phone || "N/A"}</td>
                  <td className="p-3">{p.email || "N/A"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status || "Unknown"}
                    </span>
                  </td>
                  <td className="p-3">{p.jobs || 0}</td>
                  <td className="p-3">{p.rating || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedProvider(p)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-200 flex items-center gap-1"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔍 Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full sm:w-[450px] p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-4">
              Provider Details
            </h3>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedProvider.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedProvider.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedProvider.phone || "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {selectedProvider.category || "N/A"}
              </p>
              <p>
                <strong>Jobs:</strong> {selectedProvider.jobs || 0}
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {selectedProvider.rating || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
