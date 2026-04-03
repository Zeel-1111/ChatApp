import { useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: number;
  username: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5214/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return { users };
};
