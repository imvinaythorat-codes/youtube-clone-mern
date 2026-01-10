import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Comment.deleteMany({});
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password123", 10);

    console.log("Seeding users...");
    const users = await User.insertMany([
      {
        username: "JohnDoe",
        email: "john@example.com",
        password: passwordHash,
        avatar: "https://via.placeholder.com/80x80.png?text=J"
      },
      {
        username: "JaneSmith",
        email: "jane@example.com",
        password: passwordHash,
        avatar: "https://via.placeholder.com/80x80.png?text=J"
      },
      {
        username: "DevGuru",
        email: "dev@example.com",
        password: passwordHash,
        avatar: "https://via.placeholder.com/80x80.png?text=D"
      }
    ]);

    const [john, jane, dev] = users;

    console.log("Seeding channels...");
    const channels = await Channel.insertMany([
      {
        channelName: "Code with John",
        owner: john._id,
        description: "Coding tutorials and tech reviews by John Doe.",
        channelBanner: "https://via.placeholder.com/800x200.png?text=Code+with+John",
        subscribers: 5200
      },
      {
        channelName: "JS with Jane",
        owner: jane._id,
        description: "JavaScript deep dives and interview prep.",
        channelBanner: "https://via.placeholder.com/800x200.png?text=JS+with+Jane",
        subscribers: 3100
      },
      {
        channelName: "Fullstack DevGuru",
        owner: dev._id,
        description: "Fullstack MERN projects and live coding.",
        channelBanner: "https://via.placeholder.com/800x200.png?text=Fullstack+DevGuru",
        subscribers: 8000
      }
    ]);

    const [channelJohn, channelJane, channelDev] = channels;

    await User.findByIdAndUpdate(john._id, { $set: { channels: [channelJohn._id] } });
    await User.findByIdAndUpdate(jane._id, { $set: { channels: [channelJane._id] } });
    await User.findByIdAndUpdate(dev._id, { $set: { channels: [channelDev._id] } });

    console.log("Seeding videos...");
    const videos = await Video.insertMany([
      {
        title: "Learn React in 30 Minutes",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=React+30min",
        description: "A quick tutorial to get started with React.",
        channel: channelJohn._id,
        uploader: john._id,
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        views: 15200,
        category: "React"
      },
      {
        title: "React Hooks Crash Course",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=React+Hooks",
        description: "Everything you need to know about React Hooks.",
        channel: channelJohn._id,
        uploader: john._id,
        videoUrl: "https://www.youtube.com/embed/f687hBjwFcM",
        views: 9800,
        category: "React"
      },
      {
        title: "JavaScript ES6 Features",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=JS+ES6",
        description: "Learn all important ES6 features.",
        channel: channelJane._id,
        uploader: jane._id,
        videoUrl: "https://www.youtube.com/embed/NCwa_xi0Uuc",
        views: 20400,
        category: "JavaScript"
      },
      {
        title: "Async JavaScript in 15 Minutes",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Async+JS",
        description: "Promises, async/await, and more.",
        channel: channelJane._id,
        uploader: jane._id,
        videoUrl: "https://www.youtube.com/embed/_8gHHBlbziw",
        views: 14300,
        category: "JavaScript"
      },
      {
        title: "Node.js Crash Course",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Node.js",
        description: "Build backend APIs with Node and Express.",
        channel: channelDev._id,
        uploader: dev._id,
        videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4",
        views: 18900,
        category: "Node.js"
      },
      {
        title: "MongoDB Basics for Beginners",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=MongoDB",
        description: "Collections, documents and basic CRUD.",
        channel: channelDev._id,
        uploader: dev._id,
        videoUrl: "https://www.youtube.com/embed/ok9u_nxGkq0",
        views: 7600,
        category: "MongoDB"
      },
      {
        title: "Tailwind CSS in 20 Minutes",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Tailwind+CSS",
        description: "Style your app quickly with Tailwind.",
        channel: channelDev._id,
        uploader: dev._id,
        videoUrl: "https://www.youtube.com/embed/pfaSUYaSgRo",
        views: 5400,
        category: "CSS"
      },
      {
        title: "MERN Stack Project Tutorial",
        thumbnailUrl: "https://via.placeholder.com/320x180.png?text=MERN+Project",
        description: "Build a full MERN app from scratch.",
        channel: channelDev._id,
        uploader: dev._id,
        videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
        views: 22500,
        category: "Projects"
      }
    ]);

    // Add videos to channels
    const videosByChannel = videos.reduce(
      (acc, video) => {
        acc[String(video.channel)] = [...(acc[String(video.channel)] || []), video._id];
        return acc;
      },
      {}
    );

    await Channel.findByIdAndUpdate(channelJohn._id, {
      $set: { videos: videosByChannel[String(channelJohn._id)] || [] }
    });
    await Channel.findByIdAndUpdate(channelJane._id, {
      $set: { videos: videosByChannel[String(channelJane._id)] || [] }
    });
    await Channel.findByIdAndUpdate(channelDev._id, {
      $set: { videos: videosByChannel[String(channelDev._id)] || [] }
    });

    console.log("Seeding comments...");
    await Comment.insertMany([
      {
        video: videos[0]._id,
        user: jane._id,
        text: "Great React intro, thanks!",
        timestamp: new Date()
      },
      {
        video: videos[0]._id,
        user: dev._id,
        text: "Very helpful for beginners.",
        timestamp: new Date()
      },
      {
        video: videos[2]._id,
        user: john._id,
        text: "ES6 features explained so clearly.",
        timestamp: new Date()
      },
      {
        video: videos[4]._id,
        user: jane._id,
        text: "Node.js finally makes sense!",
        timestamp: new Date()
      }
    ]);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

run();