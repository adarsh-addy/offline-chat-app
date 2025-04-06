const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const { Server } = require('socket.io');

// Init
dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: 'https://your-react-app-url.onrender.com',
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Routes
app.get('/', (req, res) => res.send('API Running...'));

// --- 🔌 SOCKET.IO Setup ---
const onlineUsers = new Map(); // userId -> socketId

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`⚡ A user connected: ${socket.id}`);

  socket.on('join', (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`✅ User ${userId} joined. Total: ${onlineUsers.size}`);
    
    // Emit the updated online users list to all clients
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    console.log(`📩 ${senderId} sent: "${message}" to ${receiverId}`);
    socket.to(receiverId).emit('receiveMessage', { senderId, message });
  });

  socket.on('disconnect', () => {
    let disconnectedUser = null;

    for (let [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        disconnectedUser = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUser) {
      console.log(`❌ User ${disconnectedUser} went offline`);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    } else {
      console.log(`❌ Unknown socket disconnected: ${socket.id}`);
    }
  });
});

// --- Server Listen ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`)
);
