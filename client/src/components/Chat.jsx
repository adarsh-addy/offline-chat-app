import React, { useEffect, useState, useRef, useCallback } from 'react';
import UsersList from './UsersList';
import axios from 'axios';
import { io } from 'socket.io-client';
import debounce from 'lodash.debounce';

const API = import.meta.env.VITE_API_URL;

// ✅ Force WebSocket transport to fix CORS/polling issue
const socket = io(API, {
  transports: ['websocket', 'polling'], // fallback if websocket fails
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        .chat-container {
          flex-direction: column !important;
        }
        .chat-area {
          width: 100% !important;
          height: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return window.location.href = '/';
    setCurrentUser(user);

    axios.get(`${API}/api/auth/users`)
      .then(res => setAllUsers(res.data.users))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    socket.emit('join', currentUser._id);

    socket.on('receiveMessage', (data) => {
      if (data.senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, {
          sender: data.senderId,
          content: data.message,
          timestamp: data.timestamp || new Date()
        }]);
      }
    });

    socket.on('online-users', (userIds) => {
      setOnlineUsers(userIds);
    });

    socket.on('typing', ({ from }) => {
      if (from === selectedUser?._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on('connect', () => {
      if (currentUser) socket.emit('join', currentUser._id);
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('online-users');
      socket.off('typing');
      socket.off('connect');
    };
  }, [currentUser, selectedUser]);

  const fetchMessages = async (user2) => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API}/api/messages/${currentUser._id}/${user2._id}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setMessages([]);
    }
  };

  const debouncedSend = useCallback(debounce(async (message) => {
    try {
      await axios.post(`${API}/api/messages`, {
        sender: currentUser._id,
        receiver: selectedUser._id,
        content: message
      });
      socket.emit('sendMessage', {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        message: message,
        timestamp: new Date()
      });
      setMessages((prev) => [...prev, {
        sender: currentUser._id,
        content: message,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
    }
  }, 500), [currentUser, selectedUser]);

  const handleSend = () => {
    if (!msg.trim()) return;
    debouncedSend(msg.trim());
    setMsg('');
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    await fetchMessages(user);
  };

  const handleTyping = () => {
    if (selectedUser) {
      socket.emit('typing', { to: selectedUser._id });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div style={styles.container} className="chat-container">
      <UsersList
        users={allUsers}
        onSelect={handleSelectUser}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
      />
      <div style={styles.chatArea} className="chat-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Chat with: {selectedUser?.name || 'No one'}</h3>
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        </div>
        <div style={styles.messages}>
          {Array.isArray(messages) && messages.map((m, idx) => (
            <div key={idx} style={{
              ...styles.msg,
              alignSelf: m.sender === currentUser?._id ? 'flex-end' : 'flex-start',
              backgroundColor: m.sender === currentUser?._id ? '#007bff' : '#eee',
              color: m.sender === currentUser?._id ? '#fff' : '#000',
            }}>
              <div>
                {m.content}
                <span style={{ fontSize: '0.75rem', marginLeft: '10px', color: '#ddd' }}>
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isTyping && <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>Typing...</div>}
          <div ref={messagesEndRef} />
        </div>
        {selectedUser && (
          <div style={styles.inputArea}>
            <input
              type="text"
              value={msg}
              onChange={(e) => { setMsg(e.target.value); handleTyping(); }}
              style={styles.input}
              placeholder="Type message..."
            />
            <button onClick={handleSend} style={styles.button}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  chatArea: {
    width: '70%',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
  },
  msg: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '60%',
    marginBottom: '8px',
  },
  inputArea: {
    display: 'flex',
    paddingTop: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  logout: {
    background: 'none',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Chat;
