// src/components/UsersList.jsx
import React, { useEffect } from 'react';

const UsersList = ({ users, onSelect, currentUser, onlineUsers }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        .users-list {
          width: 100% !important;
          height: auto !important;
          max-height: 200px;
          border-bottom: 1px solid #ccc;
          border-right: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.list} className="users-list">
      <h3 style={styles.title}>Users</h3>
      {users?.filter(user => user._id !== currentUser?._id).map(user => (
        <div
          key={user._id}
          style={styles.user}
          onClick={() => onSelect(user)}
        >
          <span style={styles.name}>{user.name}</span>
          <span
            style={{
              ...styles.statusDot,
              backgroundColor: onlineUsers.includes(user._id) ? 'green' : 'gray'
            }}
          />
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    width: '30%',
    maxHeight: '100vh',
    overflowY: 'auto',
    borderRight: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    marginBottom: '10px',
  },
  user: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px',
    marginBottom: '5px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  name: {
    fontWeight: 500,
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginLeft: '8px',
  }
};

export default UsersList;
