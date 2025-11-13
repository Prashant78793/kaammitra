import React, { useState, useEffect } from "react";
import { Bell, Moon, User, Search } from "lucide-react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ backend socket URL

const Users = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  // ✅ Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // ✅ useEffect for initial load + real-time updates
  useEffect(() => {
    fetchCustomers();

    // ✅ Listen for socket events (real-time)
    socket.on("customerAdded", (newCustomer) => {
      setCustomers((prev) => [...prev, newCustomer]);
    });

    socket.on("customerUpdated", (updated) => {
      setCustomers((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    });

    socket.on("customerDeleted", (deletedId) => {
      setCustomers((prev) => prev.filter((c) => c._id !== deletedId));
    });

    return () => {
      socket.off("customerAdded");
      socket.off("customerUpdated");
      socket.off("customerDeleted");
    };
  }, []);

  // ✅ Filter options
  const filters = ["All", "Active", "Suspended", "New"];

  // ✅ Search + Filter logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = Object.values(customer)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "All" || customer.status?.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // ✅ Statistics section
  const stats = [
    { title: "Total Customers", value: customers.length },
    {
      title: "Active Customers",
      value: customers.filter((c) => c.status === "Active").length,
    },
    {
      title: "Suspended Customers",
      value: customers.filter((c) => c.status === "Suspended").length,
    },
    {
      title: "New Signups",
      value: customers.filter((c) => {
        const createdDate = new Date(c.createdAt);
        const today = new Date();
        const diff = (today - createdDate) / (1000 * 60 * 60 * 24);
        return diff < 7;
      }).length,
    },
  ];

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Header */}
     
      {/* Search Bar */}
      <div className="flex items-center mb-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search by name, phone, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-transparent outline-none ml-2"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === item
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center"
          >
            <h3 className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </h3>
            <p className="text-xl font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm">
            <tr>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Registered</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={
                        customer.image
                          ? `http://localhost:5000/${customer.image}`
                          : "https://via.placeholder.com/40"
                      }
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        customer.status === "Active"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No customers found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
