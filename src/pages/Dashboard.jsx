import React, { useState, useContext, useEffect } from "react";
import { Users, Briefcase, DollarSign, CheckCircle } from "lucide-react";
import axios from "axios";
import { JobContext } from "../context/jobContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { addJob, jobs } = useContext(JobContext);
  const [showPopup, setShowPopup] = useState(false);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    subService: "",
    description: "",
    requirement: "",
    image: null,
  });

  // ✅ Fetch provider count
  const [providerCount, setProviderCount] = useState(0);
  useEffect(() => {
    const fetchProviderCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/providers");
        setProviderCount(res.data.length);
      } catch (err) {
        console.error("Error fetching provider count:", err);
      }
    };
    fetchProviderCount();
    const interval = setInterval(fetchProviderCount, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch customer count
  const [customerCount, setCustomerCount] = useState(0);
  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/customers");
        setCustomerCount(res.data.length);
      } catch (err) {
        console.error("Error fetching customer count:", err);
      }
    };
    fetchCustomerCount();
    const interval = setInterval(fetchCustomerCount, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch all added services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // ✅ Real-time revenue chart data
  const [revenueData, setRevenueData] = useState(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        revenue: Math.floor(50000 + Math.random() * 50000),
      };
    });
  });

  // ✅ Real-time revenue simulation (increasing/decreasing)
  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueData((prev) => {
        const lastRevenue = prev[prev.length - 1].revenue;
        const newRevenue =
          lastRevenue + Math.floor(Math.random() * 20000 - 10000); // can increase or decrease
        const today = new Date();
        const newEntry = {
          date: today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          revenue: Math.max(newRevenue, 0),
        };
        return [...prev.slice(1), newEntry]; // keep last 7 entries
      });
    }, 5000); // updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ Add Service Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, subService, description, requirement, image } = formData;

    if (!category || !subService || !description || !requirement || !image) {
      alert("Please fill all fields!");
      return;
    }

    const data = new FormData();
    data.append("category", category);
    data.append("subService", subService);
    data.append("description", description);
    data.append("requirement", requirement);
    data.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/api/jobs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServices((prev) => [...prev, res.data]);
      setShowPopup(false);
      setFormData({
        category: "",
        subService: "",
        description: "",
        requirement: "",
        image: null,
      });
    } catch (err) {
      console.error("Error adding service:", err);
      alert("Failed to add service!");
    }
  };

  const stats = [
    { title: "Total Customers", value: customerCount, icon: Users },
    { title: "Total Providers", value: providerCount, icon: CheckCircle },
    { title: "Active Jobs", value: services.length, icon: Briefcase },
    {
      title: "Today's Revenue",
      value: `Rs ${revenueData[revenueData.length - 1].revenue.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(({ title, value, icon: Icon }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center gap-4"
          >
            <Icon className="text-blue-600" size={30} />
            <div>
              <p className="text-gray-500 text-sm">{title}</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Real-time Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          Real-Time Revenue Growth
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(v) => `Rs ${v.toLocaleString()}`}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Service Button */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Quick Actions</h2>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 w-full"
        >
          Add Service
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-700">All Services</h2>
        {services.length === 0 ? (
          <p className="text-gray-500">No services added yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="border rounded-lg p-3 dark:border-gray-700 shadow"
              >
                <img
                  src={`http://localhost:5000/${service.image}`}
                  alt={service.category}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold text-lg">{service.category}</h3>
                <p className="text-sm text-gray-500">
                  Subcategory: {service.subService}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">
                  {service.description}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                  <strong>Requirements:</strong> {service.requirement}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[500px] relative">
            <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">
              Add New Service
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Service Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border rounded-md p-2"
                required
              />
              <input
                type="text"
                placeholder="Sub-Service"
                value={formData.subService}
                onChange={(e) =>
                  setFormData({ ...formData, subService: e.target.value })
                }
                className="w-full border rounded-md p-2"
                required
              />
              <textarea
                rows="3"
                placeholder="Service Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded-md p-2"
                required
              />
              <textarea
                rows="3"
                placeholder="Service Requirement"
                value={formData.requirement}
                onChange={(e) =>
                  setFormData({ ...formData, requirement: e.target.value })
                }
                className="w-full border rounded-md p-2"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="w-full"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 w-full rounded-md"
              >
                Add Service
              </button>
            </form>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
