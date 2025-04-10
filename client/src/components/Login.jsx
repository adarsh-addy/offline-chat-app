// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
const endpoint = isLogin
  ? `${baseURL}/api/auth/login`
  : `${baseURL}/api/auth/register`;

    const payload = isLogin
      ? { email, password }
      : { name, email, password };

    try {
      const res = await axios.post(endpoint, payload);
      const user = res.data.user;

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/chat');
    } catch (err) {
      console.error(err.response?.data?.msg || 'Something went wrong');
      alert(err.response?.data?.msg || 'Login/Register failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      {!isLogin && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleSubmit} style={styles.button}>
        {isLogin ? 'Login' : 'Register'}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} style={styles.switch}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  switch: {
    cursor: 'pointer',
    marginTop: '10px',
    color: '#007bff',
  },
};

export default Login;
