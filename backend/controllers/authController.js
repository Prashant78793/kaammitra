import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded credentials
    const hardcodedEmail = "pkgupta93100@gmail.com";
    const hardcodedPassword = "prashant123";

    if (email === hardcodedEmail && password === hardcodedPassword) {
      // ✅ Create token
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
