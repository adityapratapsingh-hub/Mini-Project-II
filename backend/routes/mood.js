
const express = require("express");
const router = express.Router();

const { detectMood } = require("../utils/moodDetector");
const musicData = require("../utils/musicData");
const { searchYouTube } = require("../services/youtubeService");

router.post("/", async (req, res) => {
  try {
    const { text } = req.body || {};

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your mood or select an emoji."
      });
    }

    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Please enter no more than 500 characters."
      });
    }

    const analysis = detectMood(text);
    let songs = musicData[analysis.mood] || musicData.calm;
    let source = "Built-in recommendations";

    try {
      const youtubeSongs = await searchYouTube(analysis.mood);

      if (youtubeSongs && youtubeSongs.length > 0) {
        songs = youtubeSongs;
        source = "YouTube Data API";
      }
    } catch (apiError) {
      console.error("YouTube API error:", apiError.message);
      // If the API fails, keep the built-in recommendations.
    }

    return res.json({
      success: true,
      mood: analysis.mood,
      sentimentScore: analysis.sentimentScore,
      explanation: analysis.explanation,
      source,
      songs
    });
  } catch (error) {
    console.error("Mood analysis error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not analyse your mood. Please try again."
    });
  }
});

module.exports = router;
