import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  return (
    <aside
      className={`${
        isOpen ? "w-52" : "w-0 md:w-20"
      } bg-zinc-900 border-r border-zinc-800 transition-all duration-200 overflow-hidden hidden xs:block`}
    >
      <nav className="flex flex-col py-4">
        <Link
          to="/"
          className={`px-4 py-2 text-sm hover:bg-zinc-800 ${
            location.pathname === "/" ? "font-semibold bg-zinc-800" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/channel"
          className={`px-4 py-2 text-sm hover:bg-zinc-800 ${
            location.pathname === "/channel" ? "font-semibold bg-zinc-800" : ""
          }`}
        >
          Your Channel
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;