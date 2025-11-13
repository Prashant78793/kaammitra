import React, { useState, useContext, useEffect } from "react";
import { JobContext } from "../context/jobContext";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Jobs = () => {
  const { jobs, addJob } = useContext(JobContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(false);

  // Real-time job updates
  useEffect(() => {
    socket.on("jobAdded", (job) => {
      if (job) addJob(job);
    });
    return () => socket.off("jobAdded");
  }, [addJob]);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      (j.customer || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.provider || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.jobId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || j.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // View job details
  const handleView = async (job) => {
    try {
      setLoadingJob(true);
      const res = await axios.get(`http://localhost:5000/api/jobs/${job._id}`);
      setSelectedJob(res.data);
    } catch (err) {
      console.error("Error fetching job details:", err);
      alert("Error loading job details");
    } finally {
      setLoadingJob(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Jobs / Bookings
      </h2>

      <input
        type="text"
        placeholder="Search by Job ID, customer or provider"
        className="w-full md:w-1/2 p-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-gray-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Active", "Pending", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="text-left">
              <th className="p-2">Job ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((j) => (
              <tr key={j._id} className="border-t dark:border-gray-600">
                <td className="p-2">{j.jobId}</td>
                <td className="p-2">{j.customer}</td>
                <td className="p-2">{j.provider}</td>
                <td className="p-2">{j.category}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      j.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : j.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {j.status}
                  </span>
                </td>
                <td className="p-2">{j.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleView(j)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    {loadingJob ? "Loading..." : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-96 relative">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Job Details</h3>

            {selectedJob.image && (
              <img
                src={`http://localhost:5000${selectedJob.image.startsWith("/") ? selectedJob.image : "/" + selectedJob.image}`}
                alt="Job"
                className="w-40 h-40 object-cover rounded mb-3 mx-auto"
              />
            )}

            <p><strong>ID:</strong> {selectedJob.jobId}</p>
            <p><strong>Customer:</strong> {selectedJob.customer}</p>
            <p><strong>Provider:</strong> {selectedJob.provider}</p>
            <p><strong>Category:</strong> {selectedJob.category}</p>
            <p><strong>Sub-Service:</strong> {selectedJob.subService}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Requirement:</strong> {selectedJob.requirement}</p>
            <p><strong>Status:</strong> {selectedJob.status}</p>
            <p><strong>Date:</strong> {selectedJob.date}</p>

            <button
              onClick={() => setSelectedJob(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
