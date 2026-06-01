import api from "./axios.js";

/**
 * Test backend connection
 * Run this in browser console to verify setup is working
 */
export const testBackendConnection = async () => {
  try {
    console.log("🔄 Testing backend connection...");

    const response = await api.get("/");
    console.log("✅ Backend connected:", response.data);
    return { success: true, message: response.data };
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Test auth endpoints
 */
export const testAuthRegister = async (email, password) => {
  try {
    console.log("📝 Testing register...");
    const response = await api.post("/api/auth/register", {
      email,
      password,
      firstName: "Test",
      lastName: "User",
    });
    console.log("✅ Register successful:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Register failed:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

export const testAuthLogin = async (email, password) => {
  try {
    console.log("🔐 Testing login...");
    const response = await api.post("/api/auth/login", { email, password });
    console.log("✅ Login successful:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
