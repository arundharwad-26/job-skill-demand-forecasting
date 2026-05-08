import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = "http://localhost:8000/api";

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("sf_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  async function fetchMe() {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  async function register(email, password) {
    const res = await axios.post(`${API}/auth/register`, { email, password });
    return res.data;
  }

  async function login(email, password) {
    const res  = await axios.post(`${API}/auth/login`, { email, password });
    const data = res.data;
    localStorage.setItem("sf_token", data.access_token);
    setToken(data.access_token);
    setUser({ id: data.user_id, email: data.email });
    return data;
  }

  function logout() {
    localStorage.removeItem("sf_token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);