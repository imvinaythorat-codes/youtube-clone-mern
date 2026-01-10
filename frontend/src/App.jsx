import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VideoPlayerPage from "./pages/VideoPlayerPage.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen bg-zinc-900 text-white">
          <Header
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/video/:id" element={<VideoPlayerPage />} />
                <Route
                  path="/channel"
                  element={
                    <ProtectedRoute>
                      <ChannelPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
