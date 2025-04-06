# 💬 Real-Time Chat App (MERN Stack + Socket.io)

A full-stack real-time chat application built using **MongoDB**, **Express.js**, **React**, **Node.js**, and **Socket.IO**. It supports private messaging, online status updates, typing indicators, and more.

---

## 🚀 Features

- 🔐 User Authentication (Login / Register)
- 👥 Real-time Private Chat (1-to-1)
- 🟢 Online Users Display
- ✍️ Typing Indicators
- 🕒 Message Timestamps
- 🔁 Graceful Socket Reconnection
- ✅ Debounced Message Sending
- 🔐 Logout + Auth Persistence
- 📱 Responsive Design (Inline CSS, no Tailwind)

---

## 📸 Preview

> Include a screenshot or GIF here if possible.

---

## 🛠️ Tech Stack

**Frontend:**
- React (with Vite)
- Axios
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO Server

---

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app

2. Setup Backend
cd server
npm install
npm run dev
Runs on: http://localhost:5000

3. Setup Frontend
cd client
npm install
npm run dev
Runs on: http://localhost:5173

🌐 Environment Variables
Create a .env file inside the server/ folder with the following:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
📂 Project Structure
java
Copy
Edit
client/       → React frontend (Vite)
server/       → Node/Express backend
├── models/   → Mongoose schemas
├── routes/   → API endpoints (auth, messages)
├── sockets/  → Socket.IO logic
📸 Preview
(Insert screenshots or a screen-recording GIF here)

📈 Future Enhancements
 Group Chat Support

 File/Image Sharing

 Browser Notifications

 "Last Seen" / Real-Time Status

 PWA (Progressive Web App) Support

🤝 Contributions
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to improve or add.
