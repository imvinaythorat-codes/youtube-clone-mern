import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Forms
  const [channelForm, setChannelForm] = useState({
    channelName: "",
    banner: "",
    description: ""
  });

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: ""
  });

  const [editingVideo, setEditingVideo] = useState(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch channel on mount
  useEffect(() => {
    if (channelId) {
      fetchChannel(channelId);
    } else if (isAuthenticated) {
      fetchMyChannel();
    }
  }, [channelId, isAuthenticated]);

  // Fetch channel by ID (for viewing any channel)
  const fetchChannel = async (id) => {
    try {
      const res = await api.get(`/channels/${id}`);
      setChannel(res.data);
      fetchVideos(id);
      
      // Check if current user is owner
      if (user && res.data.owner === user.userId) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch MY channel (for channel owner)
  const fetchMyChannel = async () => {
    try {
      const res = await api.get("/channels/my-channel");
      if (res.data && res.data._id) {
        setChannel(res.data);
        setIsOwner(true);
        fetchVideos(res.data._id);
      }
    } catch (err) {
      // No channel yet
      console.log("No channel found");
    }
  };

  // Fetch all videos for this channel
  const fetchVideos = async (id) => {
    try {
      const res = await api.get(`/videos?channelId=${id}`);
      setVideos(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ============== CREATE CHANNEL ==============
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/channels", channelForm);
      setChannel(res.data);
      setIsOwner(true);
      setLoading(false);
      alert("Channel created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating channel: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // ============== CREATE VIDEO ==============
  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...videoForm,
        channelId: channel._id,
        uploader: user.userId
      };
      
      const res = await api.post("/videos", payload);
      setVideos((prev) => [res.data, ...prev]);
      setShowVideoForm(false);
      setVideoForm({
        title: "",
        description: "",
        thumbnailUrl: "",
        videoUrl: "",
        category: ""
      });
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading video: " + (err.response?.data?.message || err.message));
    }
  };

  // ============== EDIT VIDEO ==============
  const handleEditVideo = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/videos/${editingVideo._id}`, editingVideo);
      
      // Update local state
      setVideos((prev) =>
        prev.map((v) => (v._id === editingVideo._id ? res.data : v))
      );
      
      setShowEditForm(false);
      setEditingVideo(null);
      alert("Video updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating video: " + (err.response?.data?.message || err.message));
    }
  };

  // ============== DELETE VIDEO ==============
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await api.delete(`/videos/${videoId}`);
      
      // Remove from local state
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
      alert("Video deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting video: " + (err.response?.data?.message || err.message));
    }
  };

  // Start editing a video
  const startEdit = (video) => {
    setEditingVideo({
      _id: video._id,
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      category: video.category
    });
    setShowEditForm(true);
    setShowVideoForm(false);
  };

  // ============== RENDER ==============

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Please login to view or create a channel</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // If no channel exists - show create form
  if (!channel) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Create Your Channel
          </h2>

          <form
            onSubmit={handleCreateChannel}
            className="space-y-4 bg-zinc-900 p-6 rounded-lg"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Channel Name *
              </label>
              <input
                type="text"
                placeholder="Enter channel name"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={channelForm.channelName}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, channelName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Banner Image URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/banner.jpg"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={channelForm.banner}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, banner: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe your channel"
                rows="4"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={channelForm.description}
                onChange={(e) =>
                  setChannelForm({ ...channelForm, description: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============== CHANNEL EXISTS - SHOW CHANNEL PAGE ==============
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Channel Banner */}
      {channel.banner && (
        <div className="w-full h-32 md:h-48 lg:h-64 overflow-hidden">
          <img
            src={channel.banner}
            alt={channel.channelName}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {channel.channelName}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 mb-2">
              {channel.description}
            </p>
            <p className="text-sm text-zinc-500">
              {channel.subscribers || 0} subscribers • {videos.length} videos
            </p>
          </div>

          {/* Upload Button - Only for channel owner */}
          {isOwner && (
            <button
              onClick={() => {
                setShowVideoForm(!showVideoForm);
                setShowEditForm(false);
              }}
              className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap"
            >
              {showVideoForm ? "Cancel" : "Upload Video"}
            </button>
          )}
        </div>

        {/* Upload Video Form */}
        {showVideoForm && isOwner && (
          <form
            onSubmit={handleVideoSubmit}
            className="space-y-4 bg-zinc-900 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Upload New Video</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                placeholder="Video title"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoForm.title}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail URL *
              </label>
              <input
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoForm.thumbnailUrl}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Video URL *
              </label>
              <input
                type="url"
                placeholder="https://example.com/video.mp4"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoForm.videoUrl}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, videoUrl: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoForm.category}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, category: e.target.value })
                }
                required
              >
                <option value="">Select category</option>
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
                <option value="Cooking">Cooking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                placeholder="Video description"
                rows="4"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoForm.description}
                onChange={(e) =>
                  setVideoForm({ ...videoForm, description: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700"
            >
              Upload Video
            </button>
          </form>
        )}

        {/* Edit Video Form */}
        {showEditForm && editingVideo && (
          <form
            onSubmit={handleEditVideo}
            className="space-y-4 bg-zinc-900 p-6 rounded-lg border-2 border-yellow-600"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Video</h3>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingVideo(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={editingVideo.title}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={editingVideo.thumbnailUrl}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    thumbnailUrl: e.target.value
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Video URL
              </label>
              <input
                type="url"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={editingVideo.videoUrl}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, videoUrl: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={editingVideo.category}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, category: e.target.value })
                }
                required
              >
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="News">News</option>
                <option value="Cooking">Cooking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full p-3 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={editingVideo.description}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    description: e.target.value
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-yellow-600 rounded-lg font-semibold hover:bg-yellow-700"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* Videos Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Channel Videos ({videos.length})
          </h2>

          {videos.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">
              No videos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition"
                >
                  {/* Thumbnail */}
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/video/${video._id}`)}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-3">
                    <h3
                      className="font-semibold mb-1 line-clamp-2 cursor-pointer hover:text-blue-400"
                      onClick={() => navigate(`/video/${video._id}`)}
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-2">
                      {video.category}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {video.views || 0} views
                    </p>

                    {/* Edit/Delete Buttons - Only for owner */}
                    {isOwner && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => startEdit(video)}
                          className="flex-1 px-3 py-1.5 bg-yellow-600 rounded text-sm font-medium hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          className="flex-1 px-3 py-1.5 bg-red-600 rounded text-sm font-medium hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;