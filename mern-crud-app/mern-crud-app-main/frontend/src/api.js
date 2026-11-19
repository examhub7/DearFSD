const RAW_API_URL = import.meta.env.VITE_API_URL || "https://mern-crud-backend-wj1m.onrender.com";
const API_URL = RAW_API_URL.replace(/\/+$/, "");

export default API_URL;
