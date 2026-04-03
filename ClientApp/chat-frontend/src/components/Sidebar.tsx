import React from "react";

interface User {
  id: number;
  username: string;
}

interface SidebarProps {
  users: User[];
  currentUsername: string;
  receiverId: string;
  onlineUsers: string[];
  onSelectUser: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ users, currentUsername, receiverId, onlineUsers, onSelectUser }) => {
  return (
    <div className="user-list">
      <h3>Users</h3>
      {users
        .filter(u => u.username !== currentUsername)
        .map(u => {
          const isOnline = onlineUsers.includes(u.id.toString());
          return (
            <div
              key={u.id}
              className={`user ${receiverId === u.id.toString() ? "active" : ""}`}
              onClick={() => onSelectUser(u.id.toString())}
            >
              <div className="user-item">
                <span className={`online-indicator ${isOnline ? "online" : "offline"}`}></span>
                {u.username}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Sidebar;
