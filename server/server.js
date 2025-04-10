const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables and DB
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// --- CORS Setup ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://chat-app-weld-tau.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// --- JSON Parser ---
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// --- Health Check Route ---
app.get('/', (req, res) => res.send('✅ API Running...'));

// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'], // ✅ This line ensures fallback to polling
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on('join', (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`✅ ${userId} joined. Online count: ${onlineUsers.size}`);
    io.emit('online-users', Array.from(onlineUsers.keys()));
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    console.log(`📩 ${senderId} -> ${receiverId}: ${message}`);
    socket.to(receiverId).emit('receiveMessage', { senderId, message });
  });

  socket.on('disconnect', () => {
    let userLeft = null;
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        userLeft = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (userLeft) {
      console.log(`❌ ${userLeft} disconnected`);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    } else {
      console.log(`❌ Unknown socket disconnected: ${socket.id}`);
    }
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
