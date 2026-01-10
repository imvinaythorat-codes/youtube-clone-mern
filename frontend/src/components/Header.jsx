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

  const userInitial =
    user?.username && user.username.length > 0
      ? user.username[0].toUpperCase()
      : null;

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shadow-sm shadow-black/40 sticky top-0 z-20">
      {/* Left: menu + logo */}
      <div className="flex items-center gap-3 min-w-[120px]">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-zinc-800"
        >
          <span className="text-2xl leading-none">≡</span>
        </button>
        <div
          className="flex items-center gap-1 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <div className="w-6 h-6 rounded-sm bg-red-600 flex items-center justify-center text-[10px] font-bold">
            ▶
          </div>
          <span className="text-base font-semibold tracking-tight">
            YouTube
          </span>
          <span className="text-xs text-zinc-400 -ml-1">
            Clone
          </span>
        </div>
      </div>

      {/* Center: search bar */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 mx-4 max-w-xl hidden sm:flex"
      >
        <input
          type="text"
          placeholder="Search by title"
          className="flex-1 px-4 py-1.5 rounded-l-full bg-zinc-900 text-sm outline-none border border-zinc-700 focus:border-blue-500"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <button
          type="submit"
          className="px-5 py-1.5 rounded-r-full bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-700 text-sm"
        >
          Search
        </button>
      </form>

      {/* Right: auth actions */}
      <div className="flex items-center gap-3 justify-end min-w-[120px]">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2">
              {userInitial && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold">
                  {userInitial}
                </div>
              )}
              <span className="text-sm max-w-[120px] truncate">
                {user.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-full text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700"
            >
              Logout
            </button>
          </>>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 rounded-full text-xs sm:text-sm bg-blue-600 hover:bg-blue-500"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;