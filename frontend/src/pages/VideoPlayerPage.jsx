import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const VideoPlayerPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [likeInfo, setLikeInfo] = useState({
    likesCount: 0,
    dislikesCount: 0
  });

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data);
      setLikeInfo({
        likesCount: res.data.likes?.length || 0,
        dislikesCount: res.data.dislikes?.length || 0
      });
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/video/${id}`);
      setComments(res.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post(`/videos/${id}/like`);
      setLikeInfo({
        likesCount: res.data.likesCount,
        dislikesCount: res.data.dislikesCount
      });
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.post(`/videos/${id}/dislike`);
      setLikeInfo({
        likesCount: res.data.likesCount,
        dislikesCount: res.data.dislikesCount
      });
    } catch (error) {
      console.error("Dislike error:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;

    setLoading(true);
    try {
      const res = await api.post(`/comments/video/${id}`, {
        text: newComment.trim()
      });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingText(comment.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editingCommentId || !editingText.trim()) return;

    try {
      const res = await api.put(`/comments/${editingCommentId}`, {
        text: editingText.trim()
      });
      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? res.data.comment : c))
      );
      cancelEdit();
    } catch (error) {
      console.error("Update comment error:", error);
    }
  };

  const handleDeleteComment = async (idToDelete) => {
    try {
      await api.delete(`/comments/${idToDelete}`);
      setComments((prev) => prev.filter((c) => c._id !== idToDelete));
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  if (!video) {
    return (
      <div className="p-4">
        <p className="text-sm text-zinc-400">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="flex-1">
        {/* Video player */}
        <div className="w-full aspect-video bg-black mb-3 rounded-xl overflow-hidden">
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        <h2 className="text-lg font-semibold mb-1">
          {video.title}
        </h2>
        <p className="text-sm text-zinc-400 mb-1">
          {video.channel?.channelName || "Unknown Channel"}
        </p>
        <p className="text-xs text-zinc-500 mb-3">
          {video.views} views
        </p>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm disabled:opacity-60"
          >
            👍 Like ({likeInfo.likesCount})
          </button>
          <button
            onClick={handleDislike}
            disabled={!isAuthenticated}
            className="px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm disabled:opacity-60"
          >
            👎 Dislike ({likeInfo.dislikesCount})
          </button>
        </div>

        <p className="text-sm text-zinc-200 mb-4 whitespace-pre-line">
          {video.description}
        </p>

        {/* Comment form */}
        <section>
          <h3 className="text-md font-semibold mb-2">
            Comments
          </h3>
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-4">
              <textarea
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm outline-none focus:border-blue-500"
                rows="3"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-sm disabled:opacity-60"
                >
                  {loading ? "Posting..." : "Comment"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-xs text-zinc-400 mb-4">
              Sign in to add and manage comments.
            </p>
          )}

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map((comment) => {
              const isOwner = user && comment.user && comment.user._id === user.id;
              const isEditing = editingCommentId === comment._id;

              return (
                <div
                  key={comment._id}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
                    {comment.user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {comment.user?.username || "User"}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {isEditing ? (
                      <form onSubmit={handleUpdateComment} className="mt-1">
                        <textarea
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-sm outline-none focus:border-blue-500"
                          rows="2"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-1">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-xs"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded-md text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-zinc-200 mt-1">
                        {comment.text}
                      </p>
                    )}
                    {isOwner && !isEditing && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-xs text-blue-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {comments.length === 0 && (
              <p className="text-xs text-zinc-400">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Right side placeholder (like YouTube recommendations) */}
      <aside className="w-full lg:w-80">
        <div className="hidden lg:block border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400">
          Additional videos / recommendations can go here (optional).
        </div>
      </aside>
    </div>
  );
};

export default VideoPlayerPage;