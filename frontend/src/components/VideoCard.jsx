import React from "react";
import { useNavigate } from "react-router-dom";

const formatViews = (views) => {
  if (!views && views !== 0) return "0 views";
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-2">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-sm font-semibold line-clamp-2 mb-1">
        {video.title}
      </h3>
      <p className="text-xs text-zinc-400">
        {video.channel?.channelName || "Unknown Channel"}
      </p>
      <p className="text-xs text-zinc-500">
        {formatViews(video.views)}
      </p>
    </div>
  );
};

export default VideoCard;