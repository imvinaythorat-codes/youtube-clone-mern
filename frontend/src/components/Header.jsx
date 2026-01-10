import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useHomeSearch } from "../pages/HomePage.jsx";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, triggerSearch } = useHomeSearch();
  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(localSearch);
    triggerSearch();
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-zinc-800"
        >
          <span className="material-icons text-white">menu</span>
        </button>
        <h1
          className="text-xl font-bold text-red-500 cursor-pointer"
          onClick={() => navigate("/")}
        >
          YouTube Clone
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 mx-4 max-w-xl flex"
      >
        <input
          type="text"
          placeholder="Search by title"
          className="flex-1 px-3 py-1 rounded-l-full bg-zinc-800 text-sm outline-none border border-zinc-700 focus:border-blue-500"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-1 rounded-r-full bg-zinc-700 hover:bg-zinc-600 border border-l-0 border-zinc-700 text-sm"
        >
          Search
        </button>
      </form>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm hidden sm:inline">
              {user.username}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-full text-sm bg-zinc-800 hover:bg-zinc-700"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 rounded-full text-sm bg-blue-600 hover:bg-blue-500"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;