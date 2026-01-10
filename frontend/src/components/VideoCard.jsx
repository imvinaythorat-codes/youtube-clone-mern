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
  const channelName = video.channel?.channelName || "Unknown Channel";
  const initial =
    channelName && channelName.length > 0
      ? channelName[0].toUpperCase()
      : "C";

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-2 hover:rounded-2xl transition-all duration-150">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-200"
        />
      </div>

      <div className="flex gap-2">
        <div className="mt-1">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-semibold">
            {initial}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2 mb-0.5">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 truncate">
            {channelName}
          </p>
          <p className="text-xs text-zinc-500">
            {formatViews(video.views)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;import React from "react";
import { useNavigate } from "react-router-dom";

const formatViews = (views) => {
  if (!views && views !== 0) return "0 views";
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const channelName = video.channel?.channelName || "Unknown Channel";
  const initial =
    channelName && channelName.length > 0
      ? channelName[0].toUpperCase()
      : "C";

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-2 hover:rounded-2xl transition-all duration-150">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-200"
        />
      </div>

      <div className="flex gap-2">
        <div className="mt-1">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-semibold">
            {initial}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2 mb-0.5">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 truncate">
            {channelName}
          </p>
          <p className="text-xs text-zinc-500">
            {formatViews(video.views)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;import React from "react";
import { useNavigate } from "react-router-dom";

const formatViews = (views) => {
  if (!views && views !== 0) return "0 views";
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const channelName = video.channel?.channelName || "Unknown Channel";
  const initial =
    channelName && channelName.length > 0
      ? channelName[0].toUpperCase()
      : "C";

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <div className="w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden mb-2 hover:rounded-2xl transition-all duration-150">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-200"
        />
      </div>

      <div className="flex gap-2">
        <div className="mt-1">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-semibold">
            {initial}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2 mb-0.5">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 truncate">
            {channelName}
          </p>
          <p className="text-xs text-zinc-500">
            {formatViews(video.views)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;