import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";
import VideoCard from "../components/VideoCard.jsx";

const HomeSearchContext = createContext(null);

export const HomeSearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerFlag, setTriggerFlag] = useState(0);

  const triggerSearch = () => setTriggerFlag((n) => n + 1);

  return (
    <HomeSearchContext.Provider
      value={{ searchTerm, setSearchTerm, triggerSearch, triggerFlag }}
    >
      {children}
    </HomeSearchContext.Provider>
  );
};

export const useHomeSearch = () => useContext(HomeSearchContext) || {
  searchTerm: "",
  setSearchTerm: () => {},
  triggerSearch: () => {},
  triggerFlag: 0
};

const categories = [
  "All",
  "React",
  "JavaScript",
  "Node.js",
  "MongoDB",
  "CSS",
  "Interview",
  "Projects"
];

const HomePageContent = () => {
  const { searchTerm, triggerFlag } = useHomeSearch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== "All") params.category = selectedCategory;

      const res = await api.get("/videos", { params });
      setVideos(res.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, triggerFlag]);

  return (
    <div className="px-4 py-3">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-white text-black"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video grid */}
      {loading ? (
        <p className="text-sm text-zinc-400">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-sm text-zinc-400">No videos found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  return (
    <HomeSearchProvider>
      <HomePageContent />
    </HomeSearchProvider>
  );
};

export default HomePage;