import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChannelPage = () => {
  const { user, isAuthenticated } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: ""
  });

  // 🔹 FETCH CHANNEL + VIDEOS USING EXISTING BACKEND ROUTES
  useEffect(() => {
    const fetchChannelAndVideos = async () => {
      try {
        if (!user || !user.channel) {
          setLoading(false);
          return;
        }

        const channelRes = await api.get(`/channels/${user.channel}`);
        setChannel(channelRes.data);

        const videosRes = await api.get(
          `/channels/${user.channel}/videos`
        );
        setVideos(videosRes.data || []);
      } catch (error) {
        console.error("Channel fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchChannelAndVideos();
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setVideoForm({ ...videoForm, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setVideoForm({
      title: "",
      description: "",
      thumbnailUrl: "",
      videoUrl: "",
      category: ""
    });
    setEditingVideoId(null);
    setShowForm(false);
  };

  // 🔹 CREATE / UPDATE VIDEO
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVideoId) {
        const res = await api.put(
          `/videos/${editingVideoId}`,
          videoForm
        );
        setVideos((prev) =>
          prev.map((v) =>
            v._id === editingVideoId ? res.data : v
          )
        );
      } else {
        const res = await api.post("/videos", videoForm);
        setVideos((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (error) {
      console.error("Video submit error:", error);
    }
  };

  const handleEdit = (video) => {
    setEditingVideoId(video._id);
    setVideoForm({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await api.delete(`/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Delete video error:", error);
    }
  };

  // 🔒 AUTH GUARDS
  if (!isAuthenticated) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Sign in to manage your channel.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Loading channel...
      </div>
    );
  }

  if (!user?.channel) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        You don’t have a channel yet. Create one first.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* CHANNEL HEADER */}
      <div>
        <h2 className="text-xl font-semibold">
          {channel?.channelName}
        </h2>
        <p className="text-sm text-zinc-400">
          {channel?.description}
        </p>
      </div>

      {/* UPLOAD BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600 rounded text-sm"
      >
        Upload Video
      </button>

      {/* UPLOAD / EDIT FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-zinc-900 p-4 rounded"
        >
          <h3 className="text-sm font-semibold">
            {editingVideoId ? "Edit Video" : "Upload Video"}
          </h3>

          <input
            name="title"
            placeholder="Title"
            value={videoForm.title}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-800 rounded"
            required
          />

          <input
            name="thumbnailUrl"
            placeholder="Thumbnail URL"
            value={videoForm.thumbnailUrl}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-800 rounded"
            required
          />

          <input
            name="videoUrl"
            placeholder="Video URL (YouTube embed)"
            value={videoForm.videoUrl}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-800 rounded"
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={videoForm.category}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-800 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={videoForm.description}
            onChange={handleChange}
            className="w-full p-2 bg-zinc-800 rounded"
            rows="3"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-1 bg-green-600 rounded text-sm"
            >
              {editingVideoId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-1 bg-zinc-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* VIDEO LIST */}
      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video._id}
            className="flex justify-between items-center bg-zinc-900 p-3 rounded"
          >
            <div>
              <p className="text-sm font-semibold">
                {video.title}
              </p>
              <p className="text-xs text-zinc-400">
                {video.category}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(video)}
                className="text-xs text-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="text-xs text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <p className="text-xs text-zinc-400">
            No videos yet. Upload your first one.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;

