import React from "react";

interface LoginProps {
  users: any[];
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="login-field">
        <label>User</label>
        <select onChange={e => setUsername(e.target.value)}>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>
      </div>

      <div className="login-field">
        <label>Password</label>
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button onClick={() => onLogin(username, password)} disabled={!username || !password}>
        Login
      </button>
    </div>
  );
};

export default Login;
