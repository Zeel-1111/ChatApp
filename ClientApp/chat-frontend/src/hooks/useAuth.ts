import { useState } from "react";
import axios from "axios";
import { startConnection } from "../services/signalR";

export const useAuth = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  const login = async (selectedUsername: string, password: string) => {
    try {
      const res = await axios.post("http://localhost:5214/api/auth/login", {
        username: selectedUsername,
        password: password,
      });

      setUsername(selectedUsername);
      setToken(res.data.token);
      await startConnection(res.data.token);
      setConnected(true);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  return { token, username, connected, login };
};
