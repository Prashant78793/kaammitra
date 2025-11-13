import Provider from "../models/Provider.js";

// ✅ Add a new provider
export const addProvider = async (req, res) => {
  try {
    const { name, category, phone, email, status, jobs, rating, address, verified } = req.body;

    const providerExists = await Provider.findOne({ email });
    if (providerExists) return res.status(400).json({ message: "Provider already exists" });

    const newProvider = await Provider.create({
      name,
      category,
      phone,
      email,
      status,
      jobs,
      rating,
      address,
      verified,
    });

    res.status(201).json(newProvider);
  } catch (error) {
    console.error("Error adding provider:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all providers
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

// ✅ Get total provider stats
export const getProviderStats = async (req, res) => {
  try {
    const totalProviders = await Provider.countDocuments();
    const activeProviders = await Provider.countDocuments({ status: "Active" });
    const pendingProviders = await Provider.countDocuments({ status: "Pending" });

    res.json({
      totalProviders,
      activeProviders,
      pendingProviders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
