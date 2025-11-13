// src/context/jobContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  // ✅ Base URL for backend
  const baseURL = "http://localhost:5000";

  // Fetch jobs from backend (real-time)
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/jobs`);
      setJobs(res.data);

      // ✅ Debug image paths
      if (res.data?.length) {
        console.log(
          "Fetched Jobs:",
          res.data.map((j) => j.image)
        );
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  // Add job → POST to backend
  const addJob = async (jobData) => {
    try {
      const res = await axios.post(`${baseURL}/api/jobs`, jobData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setJobs((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  return (
    <JobContext.Provider value={{ jobs, addJob }}>
      {children}
    </JobContext.Provider>
  );
};
