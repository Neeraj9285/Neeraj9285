import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Styles
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  navlink: {
    color: "#fff",
    textDecoration: "none",
    margin: "0 10px",
    fontSize: "18px",
  },
  header: {
    backgroundColor: "#f4f4f4",
    padding: "20px",
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#007BFF",
    color: "#fff",
    textAlign: "center",
    padding: "10px",
    position: "relative",
    bottom: "0",
    width: "100%",
  },
  page: {
    padding: "20px",
    textAlign: "center",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
  },
  textarea: {
    width: "80%",
    height: "100px",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
};

// Navbar Component
const Navbar = () => (
  <nav style={styles.navbar}>
    <Link to="/" style={styles.navlink}>Home</Link>
    <Link to="/login" style={styles.navlink}>Login</Link>
    <Link to="/register" style={styles.navlink}>Register</Link>
    <Link to="/editor" style={styles.navlink}>Editor</Link>
  </nav>
);

// Header Component
const Header = () => (
  <header style={styles.header}>
    <h1>My Collaborative Website</h1>
  </header>
);

// Footer Component
const Footer = () => (
  <footer style={styles.footer}>
    <p>© 2024 My Collaborative Website. All rights reserved.</p>
  </footer>
);

// Home Page
const Home = () => (
  <div style={styles.page}>
    <h2>Welcome to My Collaborative Website</h2>
    <p>Experience real-time collaboration with our editor.</p>
  </div>
);

// Login Page
const Login = () => (
  <div style={styles.page}>
    <h2>Login</h2>
    <input type="text" placeholder="Username" style={styles.input} />
    <input type="password" placeholder="Password" style={styles.input} />
    <button style={styles.button}>Login</button>
  </div>
);

// Register Page
const Register = () => (
  <div style={styles.page}>
    <h2>Register</h2>
    <input type="text" placeholder="Username" style={styles.input} />
    <input type="email" placeholder="Email" style={styles.input} />
    <input type="password" placeholder="Password" style={styles.input} />
    <button style={styles.button}>Register</button>
  </div>
);

// Collaborative Editor Page
const CollaborativeEditor = () => {
  const [texts, setTexts] = useState([]); // To store multiple inputs
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState("Disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = new WebSocket("wss://echo.websocket.org");

    socketRef.current.onopen = () => {
      setStatus("Connected");
    };

    socketRef.current.onmessage = (event) => {
      const incomingText = event.data;
      setTexts((prevTexts) => [...prevTexts, incomingText]);
    };

    socketRef.current.onclose = () => {
      setStatus("Disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleSend = () => {
    const newText = inputText;

    // Add new text to texts array
    setTexts((prevTexts) => [...prevTexts, newText]);

    // Send updated text to WebSocket server
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(newText);
    }

    // Clear the input field after sending
    setInputText("");
  };

  return (
    <div style={styles.page}>
      <h2>Collaborative Editor</h2>
      <p>Status: {status}</p>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text here"
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
      <div>
        {texts.map((text, index) => (
          <textarea
            key={index}
            value={text}
            readOnly
            style={styles.textarea}
          />
        ))}
      </div>
    </div>
  );
};

// Main App Component
const App = () => (
  <Router>
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Navbar />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<CollaborativeEditor />} />
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;
